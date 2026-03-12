#!/usr/bin/env python3
"""Generate life-insurance state calculator pages for CalcLeap."""
import os

STATES = {
    "Alabama": {"abbr": "AL", "avg_term": 28, "avg_whole": 195, "pop": "5.1M", "median_income": 54943, "uninsured_rate": "9.2%"},
    "Alaska": {"abbr": "AK", "avg_term": 35, "avg_whole": 230, "pop": "733K", "median_income": 77790, "uninsured_rate": "12.1%"},
    "Arizona": {"abbr": "AZ", "avg_term": 30, "avg_whole": 200, "pop": "7.4M", "median_income": 65913, "uninsured_rate": "10.1%"},
    "Arkansas": {"abbr": "AR", "avg_term": 27, "avg_whole": 185, "pop": "3.0M", "median_income": 52528, "uninsured_rate": "8.4%"},
    "California": {"abbr": "CA", "avg_term": 32, "avg_whole": 215, "pop": "39.0M", "median_income": 84907, "uninsured_rate": "6.8%"},
    "Colorado": {"abbr": "CO", "avg_term": 29, "avg_whole": 198, "pop": "5.8M", "median_income": 82254, "uninsured_rate": "6.7%"},
    "Connecticut": {"abbr": "CT", "avg_term": 31, "avg_whole": 210, "pop": "3.6M", "median_income": 83771, "uninsured_rate": "4.9%"},
    "Delaware": {"abbr": "DE", "avg_term": 30, "avg_whole": 205, "pop": "1.0M", "median_income": 72724, "uninsured_rate": "5.8%"},
    "Florida": {"abbr": "FL", "avg_term": 33, "avg_whole": 220, "pop": "22.2M", "median_income": 63062, "uninsured_rate": "11.3%"},
    "Georgia": {"abbr": "GA", "avg_term": 29, "avg_whole": 198, "pop": "10.9M", "median_income": 65030, "uninsured_rate": "12.4%"},
    "Hawaii": {"abbr": "HI", "avg_term": 28, "avg_whole": 190, "pop": "1.4M", "median_income": 84857, "uninsured_rate": "3.5%"},
    "Idaho": {"abbr": "ID", "avg_term": 27, "avg_whole": 185, "pop": "1.9M", "median_income": 65988, "uninsured_rate": "9.6%"},
    "Illinois": {"abbr": "IL", "avg_term": 30, "avg_whole": 205, "pop": "12.5M", "median_income": 72205, "uninsured_rate": "6.2%"},
    "Indiana": {"abbr": "IN", "avg_term": 28, "avg_whole": 192, "pop": "6.8M", "median_income": 61944, "uninsured_rate": "7.8%"},
    "Iowa": {"abbr": "IA", "avg_term": 26, "avg_whole": 182, "pop": "3.2M", "median_income": 65573, "uninsured_rate": "4.7%"},
    "Kansas": {"abbr": "KS", "avg_term": 27, "avg_whole": 188, "pop": "2.9M", "median_income": 64521, "uninsured_rate": "7.9%"},
    "Kentucky": {"abbr": "KY", "avg_term": 29, "avg_whole": 198, "pop": "4.5M", "median_income": 55573, "uninsured_rate": "5.3%"},
    "Louisiana": {"abbr": "LA", "avg_term": 31, "avg_whole": 210, "pop": "4.6M", "median_income": 52087, "uninsured_rate": "8.1%"},
    "Maine": {"abbr": "ME", "avg_term": 28, "avg_whole": 192, "pop": "1.4M", "median_income": 64767, "uninsured_rate": "5.7%"},
    "Maryland": {"abbr": "MD", "avg_term": 30, "avg_whole": 205, "pop": "6.2M", "median_income": 87063, "uninsured_rate": "5.6%"},
    "Massachusetts": {"abbr": "MA", "avg_term": 31, "avg_whole": 210, "pop": "7.0M", "median_income": 89645, "uninsured_rate": "2.9%"},
    "Michigan": {"abbr": "MI", "avg_term": 28, "avg_whole": 195, "pop": "10.0M", "median_income": 63498, "uninsured_rate": "5.6%"},
    "Minnesota": {"abbr": "MN", "avg_term": 27, "avg_whole": 188, "pop": "5.7M", "median_income": 77706, "uninsured_rate": "4.0%"},
    "Mississippi": {"abbr": "MS", "avg_term": 30, "avg_whole": 205, "pop": "2.9M", "median_income": 48610, "uninsured_rate": "11.1%"},
    "Missouri": {"abbr": "MO", "avg_term": 28, "avg_whole": 193, "pop": "6.2M", "median_income": 61043, "uninsured_rate": "8.7%"},
    "Montana": {"abbr": "MT", "avg_term": 27, "avg_whole": 187, "pop": "1.1M", "median_income": 60560, "uninsured_rate": "7.5%"},
    "Nebraska": {"abbr": "NE", "avg_term": 26, "avg_whole": 183, "pop": "2.0M", "median_income": 66644, "uninsured_rate": "6.8%"},
    "Nevada": {"abbr": "NV", "avg_term": 31, "avg_whole": 208, "pop": "3.2M", "median_income": 65686, "uninsured_rate": "10.5%"},
    "New Hampshire": {"abbr": "NH", "avg_term": 28, "avg_whole": 192, "pop": "1.4M", "median_income": 83449, "uninsured_rate": "5.2%"},
    "New Jersey": {"abbr": "NJ", "avg_term": 31, "avg_whole": 210, "pop": "9.3M", "median_income": 85751, "uninsured_rate": "7.0%"},
    "New Mexico": {"abbr": "NM", "avg_term": 29, "avg_whole": 197, "pop": "2.1M", "median_income": 53992, "uninsured_rate": "9.4%"},
    "New York": {"abbr": "NY", "avg_term": 33, "avg_whole": 225, "pop": "19.5M", "median_income": 74314, "uninsured_rate": "5.7%"},
    "North Carolina": {"abbr": "NC", "avg_term": 29, "avg_whole": 198, "pop": "10.7M", "median_income": 62891, "uninsured_rate": "9.3%"},
    "North Dakota": {"abbr": "ND", "avg_term": 25, "avg_whole": 178, "pop": "779K", "median_income": 68131, "uninsured_rate": "6.5%"},
    "Ohio": {"abbr": "OH", "avg_term": 28, "avg_whole": 194, "pop": "11.8M", "median_income": 59855, "uninsured_rate": "6.1%"},
    "Oklahoma": {"abbr": "OK", "avg_term": 29, "avg_whole": 198, "pop": "4.0M", "median_income": 56956, "uninsured_rate": "12.8%"},
    "Oregon": {"abbr": "OR", "avg_term": 29, "avg_whole": 198, "pop": "4.2M", "median_income": 71562, "uninsured_rate": "5.9%"},
    "Pennsylvania": {"abbr": "PA", "avg_term": 29, "avg_whole": 200, "pop": "13.0M", "median_income": 67587, "uninsured_rate": "5.5%"},
    "Rhode Island": {"abbr": "RI", "avg_term": 30, "avg_whole": 205, "pop": "1.1M", "median_income": 71169, "uninsured_rate": "3.8%"},
    "South Carolina": {"abbr": "SC", "avg_term": 29, "avg_whole": 198, "pop": "5.3M", "median_income": 59318, "uninsured_rate": "9.6%"},
    "South Dakota": {"abbr": "SD", "avg_term": 26, "avg_whole": 180, "pop": "909K", "median_income": 63920, "uninsured_rate": "8.4%"},
    "Tennessee": {"abbr": "TN", "avg_term": 29, "avg_whole": 198, "pop": "7.1M", "median_income": 59695, "uninsured_rate": "9.5%"},
    "Texas": {"abbr": "TX", "avg_term": 31, "avg_whole": 210, "pop": "30.5M", "median_income": 67321, "uninsured_rate": "16.6%"},
    "Utah": {"abbr": "UT", "avg_term": 25, "avg_whole": 175, "pop": "3.4M", "median_income": 78794, "uninsured_rate": "8.6%"},
    "Vermont": {"abbr": "VT", "avg_term": 28, "avg_whole": 192, "pop": "647K", "median_income": 63477, "uninsured_rate": "3.7%"},
    "Virginia": {"abbr": "VA", "avg_term": 29, "avg_whole": 200, "pop": "8.6M", "median_income": 80963, "uninsured_rate": "6.4%"},
    "Washington": {"abbr": "WA", "avg_term": 29, "avg_whole": 200, "pop": "7.8M", "median_income": 82228, "uninsured_rate": "5.8%"},
    "West Virginia": {"abbr": "WV", "avg_term": 30, "avg_whole": 205, "pop": "1.8M", "median_income": 50884, "uninsured_rate": "5.4%"},
    "Wisconsin": {"abbr": "WI", "avg_term": 27, "avg_whole": 188, "pop": "5.9M", "median_income": 67080, "uninsured_rate": "4.7%"},
    "Wyoming": {"abbr": "WY", "avg_term": 27, "avg_whole": 185, "pop": "577K", "median_income": 68002, "uninsured_rate": "10.3%"},
}

CSS = """*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#f5f5f7;--surface:#fff;--border:rgba(0,0,0,.08);--border-hover:rgba(0,0,0,.15);--text:#1d1d1f;--text-2:#424245;--text-3:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-bg:rgba(0,113,227,.06);--shadow:0 2px 12px rgba(0,0,0,.06);--r:16px;--r-sm:12px;--r-xs:8px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.5}
a{color:inherit;text-decoration:none}
.nav{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}
.logo{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}.logo span{color:var(--accent)}
.nav-links{display:flex;gap:.15rem}
.nav-links a{font-size:.8rem;color:var(--text-3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}
.nav-links a:hover{color:var(--text);background:rgba(0,0,0,.04)}
.page{max-width:var(--mw);margin:0 auto;padding:0 2rem}
.breadcrumb{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text-3)}
.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--accent)}
.breadcrumb .sep{margin:0 .35rem;opacity:.4}
.page-title{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}
.page-desc{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:600px}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.card h2{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}
.form-group{display:flex;flex-direction:column;gap:.3rem;margin-bottom:1rem}
.form-group label{font-size:.78rem;font-weight:600;color:var(--text-2);letter-spacing:.02em;text-transform:uppercase}
.form-group select,.form-group input{padding:.7rem .85rem;font-size:.95rem;font-family:var(--font);background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);color:var(--text);outline:none;transition:all .2s}
.form-group select:focus,.form-group input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1);background:var(--white)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.btn{display:inline-flex;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;transition:all .2s;margin-top:.5rem}
.btn:hover{background:var(--accent-hover);box-shadow:0 4px 12px rgba(0,113,227,.3)}
.results{display:none;margin-top:1.5rem}
.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:1.5rem}
.result-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.25rem;text-align:center}
.result-card .label{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3);margin-bottom:.25rem}
.result-card .value{font-size:1.5rem;font-weight:800;letter-spacing:-.03em;color:var(--accent)}
.result-card .sub{font-size:.78rem;color:var(--text-3);margin-top:.15rem}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.5rem}
.stat-card{background:var(--accent-bg);border:1px solid rgba(0,113,227,.12);border-radius:var(--r-sm);padding:1rem;text-align:center}
.stat-card .val{font-size:1.3rem;font-weight:800;color:var(--accent)}
.stat-card .lbl{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3);margin-top:.15rem}
.ad-slot{margin:1.5rem 0}
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;margin-bottom:1.25rem;box-shadow:var(--shadow)}
.info-card h3{font-size:1rem;font-weight:700;letter-spacing:-.015em;margin-bottom:1rem}
.info-card p,.info-card li{font-size:.9rem;color:var(--text-2);line-height:1.6;margin-bottom:.5rem}
.info-card ul{padding-left:1.25rem}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.5rem;margin-top:.75rem}
.related-grid a{display:block;padding:.6rem .85rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.82rem;font-weight:500;color:var(--text-2);transition:all .15s}
.related-grid a:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-bg)}
.faq-item{border-bottom:1px solid var(--border);padding:1rem 0}
.faq-item:last-child{border:none}
.faq-q{font-weight:700;font-size:.92rem;margin-bottom:.5rem;color:var(--text)}
.faq-a{font-size:.88rem;color:var(--text-2);line-height:1.6}
.footer{background:var(--white);border-top:1px solid var(--border);margin-top:3rem;padding:2.5rem 2rem}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;font-size:.8rem;color:var(--text-3)}
.footer-col h4{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem;color:var(--text-2)}
.footer-col a{display:block;padding:.2rem 0;color:var(--text-3);transition:color .15s}
.footer-col a:hover{color:var(--accent)}
.footer-bottom{text-align:center;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);font-size:.75rem}
@media(max-width:768px){.page-title{font-size:1.5rem}.form-row{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr}.stat-grid{grid-template-columns:repeat(2,1fr)}.footer-inner{grid-template-columns:repeat(2,1fr)}}"""

def slug(name):
    return name.lower().replace(" ", "-")

def gen_state_page(state, data):
    sl = slug(state)
    fname = f"{sl}-life-insurance-calculator.html"
    coverage_10x = data["median_income"] * 10
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{state} Life Insurance Calculator — Estimate Term & Whole Life Rates | CalcLeap</title>
<meta name="description" content="Calculate life insurance costs in {state}. Compare term vs whole life rates. Average term: ${data['avg_term']}/mo. Average whole life: ${data['avg_whole']}/mo. Free instant quote estimate.">
<link rel="canonical" href="https://calcleap.com/life-insurance/{fname}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<meta property="og:title" content="{state} Life Insurance Calculator — CalcLeap">
<meta property="og:description" content="Estimate life insurance costs in {state}. Term: ~${data['avg_term']}/mo. Whole life: ~${data['avg_whole']}/mo.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://calcleap.com/life-insurance/{fname}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"WebApplication","name":"{state} Life Insurance Calculator","description":"Calculate estimated life insurance premiums in {state}. Compare term and whole life rates.","url":"https://calcleap.com/life-insurance/{fname}","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{{"@type":"Offer","price":"0","priceCurrency":"USD"}}}}</script>
<style>{CSS}</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a class="logo" href="/">Calc<span>Leap</span></a><div class="nav-links"><a href="/">Home</a><a href="/life-insurance/">Life Insurance</a><a href="/state-taxes.html">Taxes</a></div></div></nav>
<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span><a href="/life-insurance/">Life Insurance</a><span class="sep">›</span>{state}</div>
<h1 class="page-title">{state} Life Insurance Calculator</h1>
<p class="page-desc">Estimate your life insurance premium in {state}. Compare term and whole life rates based on your age, health, and coverage needs.</p>

<div class="stat-grid">
<div class="stat-card"><div class="val">${data['avg_term']}/mo</div><div class="lbl">Avg Term Life</div></div>
<div class="stat-card"><div class="val">${data['avg_whole']}/mo</div><div class="lbl">Avg Whole Life</div></div>
<div class="stat-card"><div class="val">{data['pop']}</div><div class="lbl">Population</div></div>
<div class="stat-card"><div class="val">{data['uninsured_rate']}</div><div class="lbl">Uninsured Rate</div></div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="card">
<h2>Calculate Your {state} Life Insurance Premium</h2>
<div class="form-row">
<div class="form-group"><label>Your Age</label><input type="number" id="age" value="35" min="18" max="85"></div>
<div class="form-group"><label>Gender</label><select id="gender"><option value="male">Male</option><option value="female">Female</option></select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Health Rating</label><select id="health"><option value="excellent">Excellent (Preferred Plus)</option><option value="good" selected>Good (Preferred)</option><option value="average">Average (Standard)</option><option value="poor">Below Average (Substandard)</option></select></div>
<div class="form-group"><label>Tobacco Use</label><select id="tobacco"><option value="no" selected>No</option><option value="yes">Yes</option></select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Coverage Amount</label><select id="coverage"><option value="100000">$100,000</option><option value="250000">$250,000</option><option value="500000" selected>$500,000</option><option value="750000">$750,000</option><option value="1000000">$1,000,000</option><option value="2000000">$2,000,000</option></select></div>
<div class="form-group"><label>Term Length</label><select id="term"><option value="10">10 Years</option><option value="20" selected>20 Years</option><option value="30">30 Years</option></select></div>
</div>
<button class="btn" onclick="calculate()">Calculate Premium</button>

<div class="results" id="results">
<div class="result-grid">
<div class="result-card"><div class="label">Term Life (Monthly)</div><div class="value" id="termMonthly">—</div><div class="sub" id="termAnnual"></div></div>
<div class="result-card"><div class="label">Whole Life (Monthly)</div><div class="value" id="wholeMonthly">—</div><div class="sub" id="wholeAnnual"></div></div>
<div class="result-card"><div class="label">Recommended Coverage</div><div class="value" id="recCoverage">—</div><div class="sub">Based on {state} median income</div></div>
</div>
</div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="info-card">
<h3>Life Insurance in {state}: What You Need to Know</h3>
<p>{state} residents have several options for life insurance coverage. The state's Department of Insurance regulates all life insurance policies sold in {state}, ensuring consumer protections are in place.</p>
<ul>
<li><strong>Average term life premium:</strong> ${data['avg_term']}/month for a 35-year-old (20-year, $500K policy)</li>
<li><strong>Average whole life premium:</strong> ${data['avg_whole']}/month for a 35-year-old ($500K policy)</li>
<li><strong>Recommended coverage:</strong> 10-12x your annual income (${data['median_income']:,} median in {state} = ${coverage_10x:,}+ recommended)</li>
<li><strong>Uninsured rate:</strong> {data['uninsured_rate']} of {state} residents lack life insurance</li>
</ul>
</div>

<div class="info-card">
<h3>Types of Life Insurance Available in {state}</h3>
<ul>
<li><strong>Term Life Insurance:</strong> Most affordable option. Covers you for a specific period (10-30 years). Ideal for mortgage protection, income replacement during working years.</li>
<li><strong>Whole Life Insurance:</strong> Permanent coverage with cash value accumulation. Higher premiums but lifelong protection. Good for estate planning.</li>
<li><strong>Universal Life Insurance:</strong> Flexible premiums and death benefits. Builds cash value based on market rates.</li>
<li><strong>Variable Life Insurance:</strong> Investment component allows cash value growth tied to market performance.</li>
<li><strong>Final Expense Insurance:</strong> Small whole life policies ($5K-$25K) designed to cover funeral and burial costs.</li>
</ul>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="info-card">
<h3>Factors That Affect Life Insurance Rates in {state}</h3>
<ul>
<li><strong>Age:</strong> Younger applicants pay significantly less. Rates increase roughly 8-10% per year of age.</li>
<li><strong>Health:</strong> Medical history, BMI, blood pressure, and cholesterol levels all factor into pricing.</li>
<li><strong>Tobacco use:</strong> Smokers typically pay 2-3x more than non-smokers.</li>
<li><strong>Gender:</strong> Women generally pay 15-25% less due to longer life expectancy.</li>
<li><strong>Occupation:</strong> High-risk jobs (construction, mining) may increase premiums.</li>
<li><strong>Coverage amount:</strong> Higher coverage = higher premiums, but cost per $1,000 decreases with larger policies.</li>
<li><strong>Term length:</strong> Longer terms cost more because the insurer's risk increases over time.</li>
</ul>
</div>

<div class="info-card">
<h3>Frequently Asked Questions</h3>
<div class="faq-item">
<div class="faq-q">How much life insurance do I need in {state}?</div>
<div class="faq-a">Financial advisors recommend 10-12x your annual income. With {state}'s median household income of ${data['median_income']:,}, that means ${coverage_10x:,} or more in coverage. Consider adding extra for mortgage balance, children's education, and outstanding debts.</div>
</div>
<div class="faq-item">
<div class="faq-q">Is life insurance required in {state}?</div>
<div class="faq-a">No, life insurance is not legally required in any US state including {state}. However, it's strongly recommended if you have dependents, a mortgage, or significant debts that would burden your family.</div>
</div>
<div class="faq-item">
<div class="faq-q">What's the difference between term and whole life insurance?</div>
<div class="faq-a">Term life covers you for a set period (10-30 years) at a lower cost (~${data['avg_term']}/mo in {state}). Whole life provides permanent coverage with a cash value component but costs significantly more (~${data['avg_whole']}/mo in {state}).</div>
</div>
<div class="faq-item">
<div class="faq-q">Can I get life insurance with pre-existing conditions in {state}?</div>
<div class="faq-a">Yes, though premiums will be higher. Many {state} insurers offer guaranteed issue policies that don't require medical exams. These have higher rates and lower coverage limits but ensure everyone can get some protection.</div>
</div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="info-card">
<h3>Related Calculators</h3>
<div class="related-grid">
<a href="/life-insurance/">All State Life Insurance</a>
<a href="/{sl}-tax.html">{state} Tax Calculator</a>
<a href="/calc/retirement-calculator.html">Retirement Calculator</a>
<a href="/social-security/{sl}-social-security-calculator.html">{state} Social Security</a>
<a href="/health-insurance/{sl}-health-insurance-calculator.html">{state} Health Insurance</a>
<a href="/home-insurance/{sl}-home-insurance-calculator.html">{state} Home Insurance</a>
</div>
</div>
</div>

<footer class="footer"><div class="footer-inner">
<div class="footer-col"><h4>Calculators</h4><a href="/calc/mortgage-payment.html">Mortgage</a><a href="/calc/compound-interest-calculator.html">Compound Interest</a><a href="/calc/retirement-calculator.html">Retirement</a><a href="/calc/bmi-calculator.html">BMI</a></div>
<div class="footer-col"><h4>Insurance</h4><a href="/life-insurance/">Life Insurance</a><a href="/auto-insurance/">Auto Insurance</a><a href="/health-insurance/">Health Insurance</a><a href="/home-insurance/">Home Insurance</a></div>
<div class="footer-col"><h4>Taxes</h4><a href="/state-taxes.html">State Taxes</a><a href="/federal-income-tax.html">Federal Tax</a><a href="/self-employment-tax-calculator.html">Self-Employment</a><a href="/quarterly-tax.html">Quarterly Tax</a></div>
<div class="footer-col"><h4>Company</h4><a href="/about.html">About</a><a href="/privacy.html">Privacy</a><a href="/sitemap.xml">Sitemap</a></div>
</div><div class="footer-bottom">© 2026 CalcLeap. For educational purposes only. Not financial advice.</div></footer>

<script>
const BASE_TERM={data['avg_term']}, BASE_WHOLE={data['avg_whole']};
function calculate(){{
  const age=parseInt(document.getElementById('age').value);
  const gender=document.getElementById('gender').value;
  const health=document.getElementById('health').value;
  const tobacco=document.getElementById('tobacco').value;
  const coverage=parseInt(document.getElementById('coverage').value);
  const term=parseInt(document.getElementById('term').value);
  
  // Age factor: base at 35, +8% per year above, -6% per year below
  let ageFactor=1+((age-35)*0.08);
  if(age<35) ageFactor=1+((age-35)*0.06);
  ageFactor=Math.max(0.4,ageFactor);
  
  // Gender factor
  const genderFactor=gender==='female'?0.82:1;
  
  // Health factor
  const healthFactors={{excellent:0.8,good:1,average:1.35,poor:1.85}};
  const healthFactor=healthFactors[health]||1;
  
  // Tobacco factor
  const tobaccoFactor=tobacco==='yes'?2.5:1;
  
  // Coverage factor (base is 500K)
  const coverageFactor=coverage/500000;
  
  // Term factor
  const termFactors={{10:0.7,20:1,30:1.45}};
  const termFactor=termFactors[term]||1;
  
  const termMonthly=Math.round(BASE_TERM*ageFactor*genderFactor*healthFactor*tobaccoFactor*coverageFactor*termFactor);
  const wholeMonthly=Math.round(BASE_WHOLE*ageFactor*genderFactor*healthFactor*tobaccoFactor*coverageFactor*1.1);
  
  document.getElementById('termMonthly').textContent='$'+termMonthly.toLocaleString();
  document.getElementById('termAnnual').textContent='$'+(termMonthly*12).toLocaleString()+'/year';
  document.getElementById('wholeMonthly').textContent='$'+wholeMonthly.toLocaleString();
  document.getElementById('wholeAnnual').textContent='$'+(wholeMonthly*12).toLocaleString()+'/year';
  document.getElementById('recCoverage').textContent='$'+({coverage_10x}).toLocaleString();
  document.getElementById('results').style.display='block';
}}
calculate();
</script>
</body>
</html>"""
    return fname, html


def gen_index():
    rows = ""
    for state, data in sorted(STATES.items()):
        sl = slug(state)
        rows += f'<a href="{sl}-life-insurance-calculator.html" class="related-grid-item" style="display:flex;justify-content:space-between;padding:.75rem .85rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.85rem;font-weight:500;color:var(--text-2);transition:all .15s"><span>{state}</span><span style="color:var(--accent);font-weight:700">~${data["avg_term"]}/mo</span></a>\n'
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Life Insurance Calculator by State — Compare Rates All 50 States | CalcLeap</title>
<meta name="description" content="Compare life insurance rates across all 50 states. Free calculators for term life, whole life, and universal life insurance. Find the best rates in your state.">
<link rel="canonical" href="https://calcleap.com/life-insurance/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<style>{CSS}</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a class="logo" href="/">Calc<span>Leap</span></a><div class="nav-links"><a href="/">Home</a><a href="/state-taxes.html">Taxes</a><a href="/auto-insurance/">Auto Insurance</a></div></div></nav>
<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span>Life Insurance</div>
<h1 class="page-title">Life Insurance Calculator by State</h1>
<p class="page-desc">Compare estimated life insurance rates across all 50 states. Select your state to calculate personalized term and whole life insurance premiums.</p>

<div class="stat-grid">
<div class="stat-card"><div class="val">$25-35</div><div class="lbl">Avg Term Life/Mo</div></div>
<div class="stat-card"><div class="val">$175-230</div><div class="lbl">Avg Whole Life/Mo</div></div>
<div class="stat-card"><div class="val">50</div><div class="lbl">State Calculators</div></div>
<div class="stat-card"><div class="val">Free</div><div class="lbl">Instant Estimates</div></div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="card">
<h2>Select Your State</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.5rem">
{rows}
</div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>

<div class="info-card">
<h3>Understanding Life Insurance Costs</h3>
<p>Life insurance premiums vary significantly by state, age, health, and coverage type. Term life insurance is the most affordable option, typically costing $25-35/month for a healthy 35-year-old with $500,000 in coverage. Whole life insurance provides permanent coverage but costs 5-10x more.</p>
<p>Key factors that determine your rate:</p>
<ul>
<li><strong>Age:</strong> Every year you wait increases premiums by ~8-10%</li>
<li><strong>Health:</strong> Excellent health can save you 20-40% on premiums</li>
<li><strong>Tobacco use:</strong> Smokers pay 2-3x more than non-smokers</li>
<li><strong>Coverage amount:</strong> More coverage costs more, but per-unit cost decreases</li>
<li><strong>State regulations:</strong> Some states have rate restrictions that affect pricing</li>
</ul>
</div>

<div class="info-card">
<h3>Related Resources</h3>
<div class="related-grid">
<a href="/calc/retirement-calculator.html">Retirement Calculator</a>
<a href="/health-insurance/">Health Insurance by State</a>
<a href="/auto-insurance/">Auto Insurance by State</a>
<a href="/home-insurance/">Home Insurance by State</a>
<a href="/social-security/">Social Security by State</a>
<a href="/disability-insurance/">Disability Insurance</a>
</div>
</div>
</div>

<footer class="footer"><div class="footer-inner">
<div class="footer-col"><h4>Calculators</h4><a href="/calc/mortgage-payment.html">Mortgage</a><a href="/calc/compound-interest-calculator.html">Compound Interest</a><a href="/calc/retirement-calculator.html">Retirement</a></div>
<div class="footer-col"><h4>Insurance</h4><a href="/life-insurance/">Life Insurance</a><a href="/auto-insurance/">Auto Insurance</a><a href="/health-insurance/">Health Insurance</a></div>
<div class="footer-col"><h4>Taxes</h4><a href="/state-taxes.html">State Taxes</a><a href="/federal-income-tax.html">Federal Tax</a></div>
<div class="footer-col"><h4>Company</h4><a href="/about.html">About</a><a href="/privacy.html">Privacy</a><a href="/sitemap.xml">Sitemap</a></div>
</div><div class="footer-bottom">© 2026 CalcLeap. For educational purposes only. Not financial advice.</div></footer>
</body>
</html>"""


if __name__ == "__main__":
    outdir = "life-insurance"
    os.makedirs(outdir, exist_ok=True)
    
    count = 0
    for state, data in STATES.items():
        fname, html = gen_state_page(state, data)
        with open(os.path.join(outdir, fname), "w") as f:
            f.write(html)
        count += 1
    
    # Index page
    with open(os.path.join(outdir, "index.html"), "w") as f:
        f.write(gen_index())
    count += 1
    
    print(f"Generated {count} life insurance pages in {outdir}/")
