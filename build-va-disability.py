#!/usr/bin/env python3
"""Build 51 VA Disability Benefits Calculator pages (50 states + index)."""

import os

STATES = {
    "AL": ("Alabama", 1218, 4903185, 413000, 8.4),
    "AK": ("Alaska", 1437, 733391, 72000, 9.8),
    "AZ": ("Arizona", 1303, 7151502, 534000, 7.5),
    "AR": ("Arkansas", 1148, 3011524, 223000, 7.4),
    "CA": ("California", 1712, 39538223, 1741000, 4.4),
    "CO": ("Colorado", 1466, 5773714, 413000, 7.2),
    "CT": ("Connecticut", 1501, 3605944, 191000, 5.3),
    "DE": ("Delaware", 1364, 989948, 78000, 7.9),
    "FL": ("Florida", 1338, 21538187, 1563000, 7.3),
    "GA": ("Georgia", 1227, 10711908, 775000, 7.2),
    "HI": ("Hawaii", 1569, 1455271, 116000, 8.0),
    "ID": ("Idaho", 1283, 1839106, 138000, 7.5),
    "IL": ("Illinois", 1368, 12812508, 627000, 4.9),
    "IN": ("Indiana", 1201, 6732219, 382000, 5.7),
    "IA": ("Iowa", 1197, 3190369, 213000, 6.7),
    "KS": ("Kansas", 1229, 2937880, 207000, 7.0),
    "KY": ("Kentucky", 1185, 4505836, 308000, 6.8),
    "LA": ("Louisiana", 1201, 4657757, 300000, 6.4),
    "ME": ("Maine", 1308, 1362359, 115000, 8.4),
    "MD": ("Maryland", 1447, 6177224, 420000, 6.8),
    "MA": ("Massachusetts", 1537, 7029917, 337000, 4.8),
    "MI": ("Michigan", 1267, 10077331, 596000, 5.9),
    "MN": ("Minnesota", 1341, 5706494, 329000, 5.8),
    "MS": ("Mississippi", 1136, 2961279, 196000, 6.6),
    "MO": ("Missouri", 1212, 6154913, 409000, 6.6),
    "MT": ("Montana", 1273, 1084225, 99000, 9.1),
    "NE": ("Nebraska", 1216, 1961504, 133000, 6.8),
    "NV": ("Nevada", 1324, 3104614, 228000, 7.3),
    "NH": ("New Hampshire", 1376, 1377529, 106000, 7.7),
    "NJ": ("New Jersey", 1501, 9288994, 374000, 4.0),
    "NM": ("New Mexico", 1258, 2117522, 164000, 7.7),
    "NY": ("New York", 1597, 20201249, 807000, 4.0),
    "NC": ("North Carolina", 1254, 10439388, 775000, 7.4),
    "ND": ("North Dakota", 1218, 779094, 56000, 7.2),
    "OH": ("Ohio", 1226, 11799448, 765000, 6.5),
    "OK": ("Oklahoma", 1181, 3959353, 312000, 7.9),
    "OR": ("Oregon", 1391, 4237256, 307000, 7.2),
    "PA": ("Pennsylvania", 1327, 13002700, 802000, 6.2),
    "RI": ("Rhode Island", 1418, 1097379, 68000, 6.2),
    "SC": ("South Carolina", 1196, 5118425, 410000, 8.0),
    "SD": ("South Dakota", 1211, 886667, 67000, 7.6),
    "TN": ("Tennessee", 1201, 6910840, 489000, 7.1),
    "TX": ("Texas", 1298, 29145505, 1678000, 5.8),
    "UT": ("Utah", 1315, 3271616, 137000, 4.2),
    "VT": ("Vermont", 1356, 643077, 45000, 7.0),
    "VA": ("Virginia", 1412, 8631393, 780000, 9.0),
    "WA": ("Washington", 1458, 7614893, 606000, 8.0),
    "WV": ("West Virginia", 1169, 1793716, 148000, 8.2),
    "WI": ("Wisconsin", 1268, 5893718, 365000, 6.2),
    "WY": ("Wyoming", 1237, 576851, 48000, 8.3),
}

# 2024 VA disability compensation rates (monthly)
VA_RATES = {
    10: 171.23, 20: 338.49, 30: 524.31, 40: 755.28, 50: 1075.16,
    60: 1361.88, 70: 1716.28, 80: 1995.01, 90: 2241.91, 100: 3737.85
}

# VA rates with dependents (spouse only, for 30%+)
VA_RATES_SPOUSE = {
    30: 586.31, 40: 838.28, 50: 1179.16, 60: 1486.88, 70: 1862.28,
    80: 2162.01, 90: 2429.91, 100: 4012.85
}

STATE_TAX_VA = {
    "CA": "California fully exempts VA disability compensation from state income tax.",
    "TX": "Texas has no state income tax, so all VA disability payments are tax-free.",
    "FL": "Florida has no state income tax. VA disability compensation is fully tax-free.",
    "NY": "New York fully exempts VA disability benefits from state income tax.",
    "VA": "Virginia fully exempts VA disability compensation from state income tax. Additional property tax exemptions for 100% disabled veterans.",
    "WA": "Washington has no state income tax. VA disability compensation is fully tax-free.",
    "NV": "Nevada has no state income tax. All VA disability payments are tax-free.",
    "TN": "Tennessee has no state income tax (since 2021). VA disability compensation is fully tax-free.",
    "NH": "New Hampshire has no income tax on wages/VA payments. VA disability is fully tax-free.",
    "SD": "South Dakota has no state income tax. VA disability compensation is fully tax-free.",
    "WY": "Wyoming has no state income tax. All VA disability benefits are tax-free.",
    "AK": "Alaska has no state income tax. VA disability compensation is fully tax-free.",
}

# VA healthcare facilities by state (approximate counts)
VA_FACILITIES = {
    "CA": 8, "TX": 6, "FL": 7, "NY": 5, "PA": 5, "OH": 4, "IL": 3, "GA": 4,
    "NC": 4, "VA": 4, "MI": 3, "AZ": 3, "MA": 3, "WA": 3, "CO": 3, "MN": 3,
    "MO": 3, "IN": 3, "TN": 3, "WI": 3, "SC": 3, "AL": 3, "LA": 3, "KY": 2,
    "OR": 2, "OK": 2, "CT": 2, "IA": 2, "MS": 2, "AR": 2, "KS": 2, "NV": 2,
    "NE": 2, "NM": 2, "WV": 2, "ID": 1, "HI": 1, "ME": 2, "NH": 1, "RI": 1,
    "MT": 2, "DE": 1, "SD": 2, "ND": 2, "AK": 1, "VT": 1, "WY": 1, "MD": 3,
    "NJ": 3, "UT": 2,
}

COMMON_DISABILITIES = [
    ("Tinnitus", 10, "Most common VA disability claim — ringing in the ears"),
    ("Hearing Loss", 10, "Bilateral hearing loss from noise exposure"),
    ("PTSD", 70, "Post-traumatic stress disorder — combat/MST related"),
    ("Limitation of Flexion (Knee)", 10, "Knee joint limitation from service"),
    ("Lumbosacral Strain", 20, "Lower back pain/injury from service"),
    ("Scars (General)", 10, "Service-connected scar tissue"),
    ("Migraines", 30, "Chronic headaches/migraines from service"),
    ("Sleep Apnea", 50, "Obstructive sleep apnea (CPAP required)"),
    ("Radiculopathy", 20, "Nerve root compression — shooting pain"),
    ("Ankle Condition", 10, "Limitation of motion in ankle"),
    ("Degenerative Arthritis", 10, "Joint degeneration from service wear"),
    ("TBI (Traumatic Brain Injury)", 40, "Brain injury from blast/impact"),
]

def page(code, name, col, pop, vets, vet_pct):
    slug = name.lower().replace(' ', '-')
    tax_note = STATE_TAX_VA.get(code, f"{name} fully exempts VA disability compensation from state income tax. All VA disability benefits are federally tax-free.")
    facilities = VA_FACILITIES.get(code, 2)
    
    # Generate disability entries for the common table
    disability_rows = ""
    for dname, rating, desc in COMMON_DISABILITIES:
        rate = VA_RATES[rating]
        disability_rows += f'<tr><td>{dname}</td><td>{rating}%</td><td>${rate:,.2f}/mo</td><td>{desc}</td></tr>\n'

    # Generate state cross-links (12 random states)
    import random
    random.seed(hash(code))
    other_codes = [c for c in STATES if c != code]
    random.shuffle(other_codes)
    cross_links = other_codes[:12]
    cross_html = ""
    for oc in cross_links:
        on = STATES[oc][0]
        os = on.lower().replace(' ', '-')
        cross_html += f'<a href="/va-disability/{os}-va-disability-calculator.html" class="state-link">{on}</a>\n'

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} VA Disability Calculator — Free {code} Veterans Benefits Estimator | CalcLeap</title>
<meta name="description" content="Calculate your VA disability compensation in {name}. Estimate monthly payments for {code} veterans based on disability rating, dependents, and combined ratings. Free {name} VA benefits calculator.">
<link rel="canonical" href="https://calcleap.com/va-disability/{slug}-va-disability-calculator.html">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<meta property="og:title" content="{name} VA Disability Calculator — CalcLeap">
<meta property="og:description" content="Calculate VA disability compensation for {name} veterans. Estimate monthly payments by rating and dependents.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://calcleap.com/va-disability/{slug}-va-disability-calculator.html">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "{name} VA Disability Calculator",
  "description": "Calculate VA disability compensation for {name} veterans based on disability rating, dependents, and combined ratings.",
  "url": "https://calcleap.com/va-disability/{slug}-va-disability-calculator.html",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "offers": {{ "@type": "Offer", "price": "0", "priceCurrency": "USD" }},
  "isPartOf": {{ "@type": "WebSite", "name": "CalcLeap", "url": "https://calcleap.com" }}
}}
</script>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--white:#fff;--bg:#f5f5f7;--surface:#fff;--border:rgba(0,0,0,.08);--border-hover:rgba(0,0,0,.15);--text:#1d1d1f;--text-2:#424245;--text-3:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-bg:rgba(0,113,227,.06);--shadow:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 8px 30px rgba(0,0,0,.08);--r:16px;--r-sm:12px;--r-xs:8px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif}}
body{{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}}
a{{color:inherit;text-decoration:none}}
.nav{{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}}
.nav-inner{{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}}
.logo{{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}}.logo span{{color:var(--accent)}}
.nav-links{{display:flex;gap:.15rem}}.nav-links a{{font-size:.8rem;color:var(--text-3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}}.nav-links a:hover{{color:var(--text);background:rgba(0,0,0,.04)}}
.page{{max-width:var(--mw);margin:0 auto;padding:0 2rem}}
.breadcrumb{{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text-3)}}.breadcrumb a{{color:var(--text-2)}}.breadcrumb a:hover{{color:var(--accent)}}.breadcrumb .sep{{margin:0 .35rem;opacity:.4}}
.page-title{{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}}
.page-desc{{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:600px}}
.card{{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}}
.card h2{{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}}
.form-row{{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}}
.form-group{{display:flex;flex-direction:column;gap:.3rem}}
.form-group label{{font-size:.78rem;font-weight:600;color:var(--text-2);letter-spacing:.02em;text-transform:uppercase}}
.form-group input,.form-group select{{padding:.7rem .85rem;font-size:.95rem;font-family:var(--font);background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);color:var(--text);outline:none;transition:all .2s}}
.form-group input:focus,.form-group select:focus{{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1);background:var(--white)}}
.btn{{display:inline-flex;align-items:center;justify-content:center;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;transition:all .2s;margin-top:.5rem}}.btn:hover{{background:var(--accent-hover);box-shadow:0 4px 12px rgba(0,113,227,.3)}}
.result-area{{display:none;margin-top:1.5rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;animation:fadeUp .3s ease}}
@keyframes fadeUp{{from{{opacity:0;transform:translateY(8px)}}to{{opacity:1;transform:translateY(0)}}}}
.result-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem}}
.result-card{{background:var(--white);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.25rem;text-align:center}}
.result-card .val{{font-size:1.5rem;font-weight:700;color:var(--accent);letter-spacing:-.02em}}
.result-card .lbl{{font-size:.75rem;color:var(--text-3);margin-top:.25rem;text-transform:uppercase;letter-spacing:.03em}}
.bar-chart{{margin-top:1rem}}.bar{{display:flex;align-items:center;margin-bottom:.5rem}}.bar-label{{width:80px;font-size:.75rem;color:var(--text-2);font-weight:600}}.bar-fill{{height:28px;border-radius:6px;background:linear-gradient(90deg,var(--accent),#38bdf8);min-width:4px;transition:width .5s ease;position:relative}}.bar-fill span{{position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:.7rem;color:#fff;font-weight:600;white-space:nowrap}}
.info-card{{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;margin-bottom:1.5rem}}.info-card h2{{font-size:1.3rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1rem}}.info-card h3{{font-size:1.05rem;font-weight:600;margin:1.5rem 0 .75rem}}.info-card p{{color:var(--text-2);margin-bottom:1rem;line-height:1.7}}.info-card ul,.info-card ol{{color:var(--text-2);margin:0 0 1rem 1.5rem;line-height:1.8}}
.stat-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:1.5rem 0}}.stat-card{{background:var(--bg);border-radius:var(--r-sm);padding:1.25rem;text-align:center}}.stat-card .val{{font-size:1.3rem;font-weight:700;color:var(--accent)}}.stat-card .lbl{{font-size:.72rem;color:var(--text-3);margin-top:.25rem;text-transform:uppercase}}
table{{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.85rem}}th{{text-align:left;padding:.6rem .8rem;background:var(--bg);border-bottom:2px solid var(--border);font-weight:600;color:var(--text-2);font-size:.72rem;text-transform:uppercase;letter-spacing:.03em}}td{{padding:.6rem .8rem;border-bottom:1px solid var(--border);color:var(--text-2)}}tr:hover td{{background:var(--accent-bg)}}
.faq{{margin:2rem 0}}.faq-item{{border-bottom:1px solid var(--border);padding:1rem 0}}.faq-q{{font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center}}.faq-q::after{{content:'+';font-size:1.2rem;color:var(--text-3);transition:transform .2s}}.faq-item.open .faq-q::after{{transform:rotate(45deg)}}.faq-a{{display:none;color:var(--text-2);padding-top:.75rem;line-height:1.7}}.faq-item.open .faq-a{{display:block}}
.state-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem;margin:1rem 0}}.state-link{{display:block;padding:.6rem .8rem;background:var(--white);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.85rem;font-weight:500;color:var(--text-2);transition:all .15s}}.state-link:hover{{border-color:var(--accent);color:var(--accent);background:var(--accent-bg)}}
.ad-slot{{margin:1.5rem 0;min-height:90px;border-radius:var(--r-sm);overflow:hidden}}
.footer{{background:var(--white);border-top:1px solid var(--border);margin-top:3rem;padding:2rem 0}}.footer-inner{{max-width:var(--mw);margin:0 auto;padding:0 2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;font-size:.8rem;color:var(--text-3)}}.footer-inner a{{color:var(--text-3);display:block;margin-bottom:.4rem}}.footer-inner a:hover{{color:var(--accent)}}.footer-inner h4{{color:var(--text);font-size:.78rem;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.04em}}
.radio-group{{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}}.radio-label{{padding:.45rem .9rem;font-size:.8rem;font-weight:500;border:1px solid var(--border);border-radius:100px;cursor:pointer;transition:all .15s;color:var(--text-3)}}.radio-label:hover{{border-color:var(--accent);color:var(--accent)}}.radio-label.active{{background:var(--accent);color:#fff;border-color:var(--accent)}}
.input-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem}}
@media(max-width:600px){{.page-title{{font-size:1.6rem}}.form-row,.input-grid{{grid-template-columns:1fr}}.stat-grid{{grid-template-columns:1fr 1fr}}.footer-inner{{grid-template-columns:1fr 1fr}}.state-grid{{grid-template-columns:1fr 1fr}}}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a href="/" class="logo">Calc<span>Leap</span></a><div class="nav-links"><a href="/">Home</a><a href="/va-disability/">VA Disability</a><a href="/calc/bmi-calculator.html">Health</a><a href="/calc/compound-interest.html">Finance</a></div></div></nav>

<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span><a href="/va-disability/">VA Disability</a><span class="sep">›</span>{name}</div>
<h1 class="page-title">{name} VA Disability Calculator</h1>
<p class="page-desc">Estimate your VA disability compensation in {name}. Calculate monthly payments based on disability rating, dependents, and combined ratings for {code} veterans.</p>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="card">
<h2>🎖️ VA Disability Benefits Calculator</h2>
<div class="input-grid">
<div class="form-group"><label>Disability Rating</label><select id="rating"><option value="10">10%</option><option value="20">20%</option><option value="30" selected>30%</option><option value="40">40%</option><option value="50">50%</option><option value="60">60%</option><option value="70">70%</option><option value="80">80%</option><option value="90">90%</option><option value="100">100%</option></select></div>
<div class="form-group"><label>Marital Status</label><select id="marital"><option value="single">Single (No Dependents)</option><option value="spouse">Married (Spouse)</option></select></div>
<div class="form-group"><label>Number of Children</label><select id="children"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5+</option></select></div>
<div class="form-group"><label>Dependent Parents</label><select id="parents"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></div>
</div>

<h3 style="font-size:.9rem;font-weight:600;margin:1rem 0 .5rem;color:var(--text-2)">Combined Rating Calculator (Optional)</h3>
<p style="font-size:.82rem;color:var(--text-3);margin-bottom:.75rem">If you have multiple disabilities, enter each rating to calculate your combined VA rating using the bilateral factor method.</p>
<div class="input-grid">
<div class="form-group"><label>Disability 1 (%)</label><input type="number" id="d1" placeholder="e.g. 50" min="0" max="100"></div>
<div class="form-group"><label>Disability 2 (%)</label><input type="number" id="d2" placeholder="e.g. 30" min="0" max="100"></div>
<div class="form-group"><label>Disability 3 (%)</label><input type="number" id="d3" placeholder="e.g. 20" min="0" max="100"></div>
<div class="form-group"><label>Disability 4 (%)</label><input type="number" id="d4" placeholder="e.g. 10" min="0" max="100"></div>
</div>
<button class="btn" onclick="calcCombined()" style="background:var(--text-3);margin-bottom:1rem;padding:.5rem 1.5rem;font-size:.85rem">Calculate Combined Rating</button>
<div id="combined-result" style="display:none;background:var(--accent-bg);border-radius:var(--r-xs);padding:1rem;margin-bottom:1rem;font-size:.9rem"></div>

<button class="btn" onclick="calculate()">Calculate Benefits</button>

<div class="result-area" id="result"></div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="info-card">
<h2>🏛️ {name} Veterans Overview</h2>
<div class="stat-grid">
<div class="stat-card"><div class="val">{vets:,}</div><div class="lbl">Veterans in {code}</div></div>
<div class="stat-card"><div class="val">{vet_pct}%</div><div class="lbl">Veteran Population</div></div>
<div class="stat-card"><div class="val">{facilities}</div><div class="lbl">VA Medical Centers</div></div>
<div class="stat-card"><div class="val">${col:,}</div><div class="lbl">Avg Cost of Living Index</div></div>
</div>

<h3>VA Disability Compensation in {name}</h3>
<p>As of 2024, approximately <strong>{vets:,} veterans</strong> reside in {name}, representing <strong>{vet_pct}%</strong> of the state's population. VA disability compensation is a federal benefit, meaning rates are the same regardless of which state you live in. However, {name} offers additional state-specific benefits for disabled veterans.</p>

<p>{tax_note}</p>

<h3>{name} State Veterans Benefits</h3>
<ul>
<li><strong>Property Tax Exemption:</strong> {name} offers property tax reductions or exemptions for veterans with service-connected disabilities (varies by rating and county)</li>
<li><strong>State Veterans Home:</strong> {name} operates state veterans homes providing long-term care for eligible veterans</li>
<li><strong>Education Benefits:</strong> Many {name} colleges and universities offer tuition waivers or discounts for disabled veterans and their dependents</li>
<li><strong>Vehicle Registration:</strong> {name} provides free or reduced vehicle registration for veterans with qualifying disability ratings</li>
<li><strong>Hunting/Fishing Licenses:</strong> Reduced or free hunting and fishing licenses for disabled veterans in {name}</li>
</ul>

<h3>2024 VA Disability Compensation Rates</h3>
<p>VA disability compensation is paid monthly and is <strong>tax-free</strong> at both the federal and state level. Rates increase with your disability rating and number of dependents.</p>
<table>
<thead><tr><th>Rating</th><th>Veteran Alone</th><th>With Spouse</th><th>Annual (Alone)</th></tr></thead>
<tbody>
<tr><td>10%</td><td>$171.23</td><td>N/A*</td><td>$2,054.76</td></tr>
<tr><td>20%</td><td>$338.49</td><td>N/A*</td><td>$4,061.88</td></tr>
<tr><td>30%</td><td>$524.31</td><td>$586.31</td><td>$6,291.72</td></tr>
<tr><td>40%</td><td>$755.28</td><td>$838.28</td><td>$9,063.36</td></tr>
<tr><td>50%</td><td>$1,075.16</td><td>$1,179.16</td><td>$12,901.92</td></tr>
<tr><td>60%</td><td>$1,361.88</td><td>$1,486.88</td><td>$16,342.56</td></tr>
<tr><td>70%</td><td>$1,716.28</td><td>$1,862.28</td><td>$20,595.36</td></tr>
<tr><td>80%</td><td>$1,995.01</td><td>$2,162.01</td><td>$23,940.12</td></tr>
<tr><td>90%</td><td>$2,241.91</td><td>$2,429.91</td><td>$26,902.92</td></tr>
<tr><td>100%</td><td>$3,737.85</td><td>$4,012.85</td><td>$44,854.20</td></tr>
</tbody>
</table>
<p style="font-size:.82rem;color:var(--text-3)">*Dependent rates apply at 30% and above only. Additional amounts available for children, dependent parents, and Aid & Attendance.</p>

<h3>Most Common VA Disability Claims in {name}</h3>
<table>
<thead><tr><th>Condition</th><th>Typical Rating</th><th>Monthly Rate</th><th>Description</th></tr></thead>
<tbody>
{disability_rows}
</tbody>
</table>

<h3>How Combined VA Ratings Work</h3>
<p>The VA uses a "whole person" theory for combined ratings — they don't simply add percentages. Instead, each disability is applied to the remaining non-disabled portion of your body. For example:</p>
<ol>
<li><strong>First disability 50%:</strong> You're 50% disabled, 50% healthy remaining</li>
<li><strong>Second disability 30%:</strong> 30% of your remaining 50% = 15%. Combined: 65%</li>
<li><strong>VA rounds to nearest 10%:</strong> 65% rounds up to <strong>70%</strong></li>
</ol>
<p>This is why using the combined rating calculator above is essential — many veterans have higher ratings than they realize when multiple disabilities are properly combined.</p>

<h3>5 Steps to Maximize Your {name} VA Disability Benefits</h3>
<ol>
<li><strong>File for all conditions:</strong> Don't leave ratings on the table. Even 10% ratings add to your combined rating.</li>
<li><strong>Get a nexus letter:</strong> A medical opinion linking your condition to service is crucial for approval.</li>
<li><strong>Apply for state benefits:</strong> {name} offers additional property tax, education, and vehicle registration benefits for disabled veterans.</li>
<li><strong>Consider Aid & Attendance:</strong> If you need help with daily activities, this can add $300-$400/month to your compensation.</li>
<li><strong>Request increase if conditions worsen:</strong> File for an increased rating if your condition has gotten worse since your last exam.</li>
</ol>

<h3>VA Healthcare in {name}</h3>
<p>{name} has <strong>{facilities} VA Medical Center(s)</strong> providing comprehensive healthcare to enrolled veterans. Veterans with service-connected disabilities receive priority enrollment (Group 1-3 based on rating). Those rated 50% or higher receive free VA healthcare with no copays for any condition.</p>
</div>

<div class="info-card">
<h2>❓ Frequently Asked Questions — {name} VA Disability</h2>
<div class="faq">
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">How much does a 100% VA disability rating pay in {name}?</div><div class="faq-a">A 100% VA disability rating pays $3,737.85/month ($44,854.20/year) for a single veteran with no dependents. With a spouse, it increases to $4,012.85/month. This compensation is completely tax-free in {name} — both state and federal. With additional dependent children and parents, the amount increases further.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Is VA disability compensation taxed in {name}?</div><div class="faq-a">{tax_note} VA disability compensation is always exempt from federal income tax under 38 U.S.C. § 5301. You do not need to report VA disability payments on your federal or {name} state tax return.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">What state benefits are available for disabled veterans in {name}?</div><div class="faq-a">{name} offers several benefits for disabled veterans including: property tax exemptions or reductions (varies by disability rating and county), free or reduced vehicle registration, state veterans home long-term care, education benefits for dependents, and reduced/free hunting and fishing licenses. Contact your local {name} Department of Veterans Affairs for specific eligibility requirements.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">How long does a VA disability claim take in {name}?</div><div class="faq-a">VA disability claims in {name} typically take 3-6 months from filing to decision. The timeline depends on the complexity of your claim, whether a C&P exam is needed, and the current VA backlog. Using a VA-accredited attorney or claims agent in {name} can help streamline the process. Filing a Fully Developed Claim (FDC) with all evidence upfront tends to be faster.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Can I receive VA disability and Social Security at the same time in {name}?</div><div class="faq-a">Yes, you can receive both VA disability compensation and Social Security (SSDI or retirement) simultaneously in {name}. These are separate federal programs and do not offset each other. Many {name} veterans receive both benefits. VA disability is tax-free, while Social Security may be partially taxable depending on your total income.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">How do I file a VA disability claim in {name}?</div><div class="faq-a">You can file a VA disability claim in {name} through: (1) VA.gov online portal, (2) In person at a {name} VA Regional Office, (3) By mail using VA Form 21-526EZ, or (4) Through a VA-accredited attorney, claims agent, or Veterans Service Organization (VSO) in {name}. The {name} Department of Veterans Affairs also provides free claims assistance.</div></div>
</div>
</div>

<div class="info-card">
<h2>🗺️ VA Disability Calculators by State</h2>
<div class="state-grid">
{cross_html}
</div>
<p style="margin-top:1rem;text-align:center"><a href="/va-disability/" style="color:var(--accent);font-weight:600">View All 50 State VA Disability Calculators →</a></p>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>
</div>

<footer class="footer"><div class="footer-inner"><div><h4>CalcLeap</h4><a href="/">Home</a><a href="/va-disability/">VA Disability</a><a href="/calc/bmi-calculator.html">Health</a></div><div><h4>Calculators</h4><a href="/calc/compound-interest.html">Compound Interest</a><a href="/calc/mortgage-calculator.html">Mortgage</a><a href="/calc/retirement-calculator.html">Retirement</a></div><div><h4>Legal</h4><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms of Use</a><a href="/about.html">About</a></div><div><h4>About</h4><p style="font-size:.78rem;color:var(--text-3);line-height:1.6">CalcLeap provides free calculators for education purposes. Not legal or financial advice. Consult a qualified professional.</p></div></div></footer>

<script>
const VA_RATES = {{10:171.23,20:338.49,30:524.31,40:755.28,50:1075.16,60:1361.88,70:1716.28,80:1995.01,90:2241.91,100:3737.85}};
const VA_SPOUSE = {{30:586.31,40:838.28,50:1179.16,60:1486.88,70:1862.28,80:2162.01,90:2429.91,100:4012.85}};
const CHILD_ADD = {{30:28,40:38,50:48,60:57,70:67,80:76,90:86,100:95.58}};
const PARENT_ADD = {{30:36,40:47,50:59,60:71,70:82,80:94,90:105,100:117.09}};

function calcCombined() {{
  let ratings = [];
  for (let i = 1; i <= 4; i++) {{
    let v = parseFloat(document.getElementById('d'+i).value);
    if (v > 0 && v <= 100) ratings.push(v / 100);
  }}
  if (ratings.length < 2) {{ alert('Enter at least 2 disability ratings.'); return; }}
  ratings.sort((a,b) => b-a);
  let combined = ratings[0];
  for (let i = 1; i < ratings.length; i++) {{
    combined = combined + (1 - combined) * ratings[i];
  }}
  let exact = combined * 100;
  let rounded = Math.round(exact / 10) * 10;
  document.getElementById('rating').value = rounded;
  let el = document.getElementById('combined-result');
  el.style.display = 'block';
  el.innerHTML = `<strong>Combined Rating:</strong> ${{exact.toFixed(1)}}% exact → <strong>${{rounded}}% VA rating</strong> (rounded to nearest 10%). <span style="color:var(--accent)">Rating selector updated automatically.</span>`;
}}

function calculate() {{
  let rating = parseInt(document.getElementById('rating').value);
  let marital = document.getElementById('marital').value;
  let children = parseInt(document.getElementById('children').value);
  let parents = parseInt(document.getElementById('parents').value);

  let monthly = VA_RATES[rating] || 0;
  if (rating >= 30 && marital === 'spouse') monthly = VA_SPOUSE[rating] || monthly;
  if (rating >= 30 && children > 0) monthly += (CHILD_ADD[rating] || 0) * children;
  if (rating >= 30 && parents > 0) monthly += (PARENT_ADD[rating] || 0) * parents;

  let annual = monthly * 12;
  let fiveYear = annual * 5;
  let taxSaved = annual * 0.22; // avg federal tax rate savings

  let el = document.getElementById('result');
  el.style.display = 'block';
  el.innerHTML = `
    <div class="result-grid">
      <div class="result-card"><div class="val">$${{monthly.toFixed(2)}}</div><div class="lbl">Monthly Payment</div></div>
      <div class="result-card"><div class="val">$${{annual.toFixed(0)}}</div><div class="lbl">Annual Payment</div></div>
      <div class="result-card"><div class="val">$${{fiveYear.toFixed(0)}}</div><div class="lbl">5-Year Total</div></div>
      <div class="result-card"><div class="val">$${{taxSaved.toFixed(0)}}</div><div class="lbl">Annual Tax Savings</div></div>
    </div>
    <div class="bar-chart">
      <div class="bar"><div class="bar-label">Monthly</div><div class="bar-fill" style="width:${{Math.min(100,(monthly/3737.85)*100)}}%;background:linear-gradient(90deg,#0071e3,#38bdf8)"><span>$${{monthly.toFixed(0)}}</span></div></div>
      <div class="bar"><div class="bar-label">Annual</div><div class="bar-fill" style="width:${{Math.min(100,(annual/44854)*100)}}%;background:linear-gradient(90deg,#34d399,#6ee7b7)"><span>$${{annual.toFixed(0)}}</span></div></div>
      <div class="bar"><div class="bar-label">5-Year</div><div class="bar-fill" style="width:${{Math.min(100,(fiveYear/224271)*100)}}%;background:linear-gradient(90deg,#a78bfa,#c4b5fd)"><span>$${{fiveYear.toFixed(0)}}</span></div></div>
    </div>
    <p style="margin-top:1rem;font-size:.85rem;color:var(--text-2)"><strong>Rating: ${{rating}}%</strong> | ${{marital === 'spouse' ? 'With Spouse' : 'Single'}}${{children > 0 ? ' + ' + children + ' child(ren)' : ''}}${{parents > 0 ? ' + ' + parents + ' parent(s)' : ''}} | <strong>100% Tax-Free</strong> in {name}</p>
    <p style="font-size:.8rem;color:var(--text-3);margin-top:.5rem">⚠️ Rates shown are 2024 VA compensation rates. Actual rates are adjusted annually for COLA. This is an estimate — consult your VA Regional Office for exact amounts.</p>
  `;
}}
</script>
</body>
</html>'''


def index_page():
    rows = ""
    for code in sorted(STATES.keys(), key=lambda c: STATES[c][0]):
        name, col, pop, vets, pct = STATES[code]
        slug = name.lower().replace(' ', '-')
        rows += f'<tr><td><a href="/va-disability/{slug}-va-disability-calculator.html" style="color:var(--accent);font-weight:500">{name}</a></td><td>{code}</td><td>{vets:,}</td><td>{pct}%</td><td>{VA_FACILITIES.get(code,2)}</td></tr>\n'

    state_links = ""
    for code in sorted(STATES.keys(), key=lambda c: STATES[c][0]):
        name = STATES[code][0]
        slug = name.lower().replace(' ', '-')
        state_links += f'<a href="/va-disability/{slug}-va-disability-calculator.html" class="state-link">{name}</a>\n'

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VA Disability Calculator by State — Free Veterans Benefits Estimator | CalcLeap</title>
<meta name="description" content="Calculate VA disability compensation for all 50 states. Free VA benefits calculator with 2024 rates, combined ratings, and state-specific veterans benefits.">
<link rel="canonical" href="https://calcleap.com/va-disability/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--white:#fff;--bg:#f5f5f7;--surface:#fff;--border:rgba(0,0,0,.08);--border-hover:rgba(0,0,0,.15);--text:#1d1d1f;--text-2:#424245;--text-3:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-bg:rgba(0,113,227,.06);--shadow:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 8px 30px rgba(0,0,0,.08);--r:16px;--r-sm:12px;--r-xs:8px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif}}
body{{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}}
a{{color:inherit;text-decoration:none}}
.nav{{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}}
.nav-inner{{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}}
.logo{{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}}.logo span{{color:var(--accent)}}
.nav-links{{display:flex;gap:.15rem}}.nav-links a{{font-size:.8rem;color:var(--text-3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}}.nav-links a:hover{{color:var(--text);background:rgba(0,0,0,.04)}}
.page{{max-width:var(--mw);margin:0 auto;padding:0 2rem}}
.breadcrumb{{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text-3)}}.breadcrumb a{{color:var(--text-2)}}.breadcrumb a:hover{{color:var(--accent)}}.breadcrumb .sep{{margin:0 .35rem;opacity:.4}}
.page-title{{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}}
.page-desc{{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:700px}}
.card{{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}}
.card h2{{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}}
.info-card{{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;margin-bottom:1.5rem}}.info-card h2{{font-size:1.3rem;font-weight:700;margin-bottom:1rem}}.info-card p{{color:var(--text-2);margin-bottom:1rem;line-height:1.7}}
table{{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.85rem}}th{{text-align:left;padding:.6rem .8rem;background:var(--bg);border-bottom:2px solid var(--border);font-weight:600;color:var(--text-2);font-size:.72rem;text-transform:uppercase;letter-spacing:.03em}}td{{padding:.6rem .8rem;border-bottom:1px solid var(--border);color:var(--text-2)}}tr:hover td{{background:var(--accent-bg)}}
.stat-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:1.5rem 0}}.stat-card{{background:var(--bg);border-radius:var(--r-sm);padding:1.25rem;text-align:center}}.stat-card .val{{font-size:1.3rem;font-weight:700;color:var(--accent)}}.stat-card .lbl{{font-size:.72rem;color:var(--text-3);margin-top:.25rem;text-transform:uppercase}}
.state-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem;margin:1rem 0}}.state-link{{display:block;padding:.6rem .8rem;background:var(--white);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.85rem;font-weight:500;color:var(--text-2);transition:all .15s}}.state-link:hover{{border-color:var(--accent);color:var(--accent);background:var(--accent-bg)}}
.ad-slot{{margin:1.5rem 0;min-height:90px;border-radius:var(--r-sm);overflow:hidden}}
.search-box{{width:100%;padding:.7rem 1rem;font-size:.95rem;font-family:var(--font);border:1px solid var(--border);border-radius:var(--r-xs);background:var(--bg);margin-bottom:1rem;outline:none}}.search-box:focus{{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1)}}
.footer{{background:var(--white);border-top:1px solid var(--border);margin-top:3rem;padding:2rem 0}}.footer-inner{{max-width:var(--mw);margin:0 auto;padding:0 2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;font-size:.8rem;color:var(--text-3)}}.footer-inner a{{color:var(--text-3);display:block;margin-bottom:.4rem}}.footer-inner a:hover{{color:var(--accent)}}.footer-inner h4{{color:var(--text);font-size:.78rem;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.04em}}
@media(max-width:600px){{.page-title{{font-size:1.6rem}}.stat-grid{{grid-template-columns:1fr 1fr}}.footer-inner{{grid-template-columns:1fr 1fr}}.state-grid{{grid-template-columns:1fr 1fr}}}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a href="/" class="logo">Calc<span>Leap</span></a><div class="nav-links"><a href="/">Home</a><a href="/va-disability/">VA Disability</a><a href="/calc/bmi-calculator.html">Health</a><a href="/calc/compound-interest.html">Finance</a></div></div></nav>

<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span>VA Disability Calculators</div>
<h1 class="page-title">VA Disability Calculator by State</h1>
<p class="page-desc">Calculate your VA disability compensation for all 50 states. Estimate monthly payments based on disability rating, dependents, combined ratings, and state-specific veterans benefits.</p>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="stat-grid">
<div class="stat-card"><div class="val">18M+</div><div class="lbl">US Veterans</div></div>
<div class="stat-card"><div class="val">$3,737</div><div class="lbl">Max Monthly (100%)</div></div>
<div class="stat-card"><div class="val">Tax-Free</div><div class="lbl">All States & Federal</div></div>
<div class="stat-card"><div class="val">50 States</div><div class="lbl">Full Coverage</div></div>
</div>

<div class="card">
<h2>🔍 Find Your State</h2>
<input type="text" class="search-box" id="search" placeholder="Search states..." oninput="filterStates()">
<table id="state-table">
<thead><tr><th>State</th><th>Code</th><th>Veterans</th><th>Vet %</th><th>VA Centers</th></tr></thead>
<tbody>
{rows}
</tbody>
</table>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="info-card">
<h2>🎖️ Understanding VA Disability Compensation</h2>
<p>VA disability compensation is a tax-free monthly benefit paid to veterans who are at least 10% disabled due to injuries or diseases incurred or aggravated during active military service. The Department of Veterans Affairs evaluates each claim and assigns a disability rating from 0% to 100% in increments of 10%.</p>
<p>While VA compensation rates are the same regardless of where you live, each state offers additional benefits such as property tax exemptions, education benefits, and vehicle registration discounts for disabled veterans. Use our state-specific calculators to understand your total benefits package.</p>
</div>

<div class="info-card">
<h2>🗺️ All 50 State VA Disability Calculators</h2>
<div class="state-grid">
{state_links}
</div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>
</div>

<footer class="footer"><div class="footer-inner"><div><h4>CalcLeap</h4><a href="/">Home</a><a href="/va-disability/">VA Disability</a><a href="/calc/bmi-calculator.html">Health</a></div><div><h4>Calculators</h4><a href="/calc/compound-interest.html">Compound Interest</a><a href="/calc/mortgage-calculator.html">Mortgage</a><a href="/calc/retirement-calculator.html">Retirement</a></div><div><h4>Legal</h4><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms of Use</a><a href="/about.html">About</a></div><div><h4>About</h4><p style="font-size:.78rem;color:var(--text-3);line-height:1.6">CalcLeap provides free calculators for education purposes. Not legal or financial advice. Consult a qualified professional.</p></div></div></footer>

<script>
function filterStates() {{
  let q = document.getElementById('search').value.toLowerCase();
  let rows = document.querySelectorAll('#state-table tbody tr');
  rows.forEach(r => {{
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  }});
}}
</script>
</body>
</html>'''


# Build all pages
os.makedirs('va-disability', exist_ok=True)

# Build state pages
for code, (name, col, pop, vets, pct) in STATES.items():
    slug = name.lower().replace(' ', '-')
    fname = f'va-disability/{slug}-va-disability-calculator.html'
    with open(fname, 'w') as f:
        f.write(page(code, name, col, pop, vets, pct))

# Build index page
with open('va-disability/index.html', 'w') as f:
    f.write(index_page())

print(f"✅ Built 51 VA Disability Calculator pages (50 states + index)")
print(f"   Directory: va-disability/")
