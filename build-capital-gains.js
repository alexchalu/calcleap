#!/usr/bin/env node
// Build 51 Capital Gains Tax Calculator pages (50 states + index)

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'capital-gains');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const states = [
  { abbr: 'AL', name: 'Alabama', rate: 5.0, type: 'flat', noTax: false, notes: 'Taxes capital gains as ordinary income at 2-5%', brackets: '2-5%', topRate: 5.0 },
  { abbr: 'AK', name: 'Alaska', rate: 0, type: 'none', noTax: true, notes: 'No state income tax — capital gains tax-free', brackets: 'None', topRate: 0 },
  { abbr: 'AZ', name: 'Arizona', rate: 2.5, type: 'flat', noTax: false, notes: 'Flat 2.5% tax rate on all income including capital gains', brackets: '2.5% flat', topRate: 2.5 },
  { abbr: 'AR', name: 'Arkansas', rate: 4.4, type: 'progressive', noTax: false, notes: '50% capital gains exclusion for gains over $10M (assets held 5+ years)', brackets: '2-4.4%', topRate: 4.4 },
  { abbr: 'CA', name: 'California', rate: 13.3, type: 'progressive', noTax: false, notes: 'Highest state rate in the US — no preferential capital gains treatment', brackets: '1-13.3%', topRate: 13.3 },
  { abbr: 'CO', name: 'Colorado', rate: 4.4, type: 'flat', noTax: false, notes: 'Flat 4.4% tax on all income including capital gains', brackets: '4.4% flat', topRate: 4.4 },
  { abbr: 'CT', name: 'Connecticut', rate: 6.99, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; 7% surcharge on AGI over $500K', brackets: '3-6.99%', topRate: 6.99 },
  { abbr: 'DE', name: 'Delaware', rate: 6.6, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '2.2-6.6%', topRate: 6.6 },
  { abbr: 'FL', name: 'Florida', rate: 0, type: 'none', noTax: true, notes: 'No state income tax — capital gains tax-free', brackets: 'None', topRate: 0 },
  { abbr: 'GA', name: 'Georgia', rate: 5.49, type: 'flat', noTax: false, notes: 'Flat 5.49% tax on all income including capital gains', brackets: '5.49% flat', topRate: 5.49 },
  { abbr: 'HI', name: 'Hawaii', rate: 11.0, type: 'progressive', noTax: false, notes: '7.25% preferential rate on capital gains; one of few states with special CG rate', brackets: '1.4-11%', topRate: 7.25 },
  { abbr: 'ID', name: 'Idaho', rate: 5.8, type: 'flat', noTax: false, notes: 'Flat 5.8% tax on all income including capital gains', brackets: '5.8% flat', topRate: 5.8 },
  { abbr: 'IL', name: 'Illinois', rate: 4.95, type: 'flat', noTax: false, notes: 'Flat 4.95% tax on all income including capital gains', brackets: '4.95% flat', topRate: 4.95 },
  { abbr: 'IN', name: 'Indiana', rate: 3.05, type: 'flat', noTax: false, notes: 'Flat 3.05% tax on all income including capital gains (lowest flat-tax state)', brackets: '3.05% flat', topRate: 3.05 },
  { abbr: 'IA', name: 'Iowa', rate: 5.7, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; rates being reduced', brackets: '4.4-5.7%', topRate: 5.7 },
  { abbr: 'KS', name: 'Kansas', rate: 5.7, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '3.1-5.7%', topRate: 5.7 },
  { abbr: 'KY', name: 'Kentucky', rate: 4.0, type: 'flat', noTax: false, notes: 'Flat 4.0% tax on all income including capital gains', brackets: '4.0% flat', topRate: 4.0 },
  { abbr: 'LA', name: 'Louisiana', rate: 4.25, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '1.85-4.25%', topRate: 4.25 },
  { abbr: 'ME', name: 'Maine', rate: 7.15, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates up to 7.15%', brackets: '5.8-7.15%', topRate: 7.15 },
  { abbr: 'MD', name: 'Maryland', rate: 5.75, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; plus county taxes (up to 3.2%)', brackets: '2-5.75%', topRate: 5.75 },
  { abbr: 'MA', name: 'Massachusetts', rate: 9.0, type: 'special', noTax: false, notes: '5% on income + 4% surtax on income over $1M (total 9% on gains over $1M)', brackets: '5% + 4% surtax', topRate: 9.0 },
  { abbr: 'MI', name: 'Michigan', rate: 4.25, type: 'flat', noTax: false, notes: 'Flat 4.25% tax on all income including capital gains', brackets: '4.25% flat', topRate: 4.25 },
  { abbr: 'MN', name: 'Minnesota', rate: 9.85, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; among highest state rates', brackets: '5.35-9.85%', topRate: 9.85 },
  { abbr: 'MS', name: 'Mississippi', rate: 5.0, type: 'flat', noTax: false, notes: 'Flat 5.0% tax on income over $10K including capital gains', brackets: '5.0% flat', topRate: 5.0 },
  { abbr: 'MO', name: 'Missouri', rate: 4.8, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '2-4.8%', topRate: 4.8 },
  { abbr: 'MT', name: 'Montana', rate: 6.75, type: 'progressive', noTax: false, notes: '2% capital gains credit available for Montana-source gains', brackets: '1-6.75%', topRate: 6.75 },
  { abbr: 'NE', name: 'Nebraska', rate: 6.64, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '2.46-6.64%', topRate: 6.64 },
  { abbr: 'NV', name: 'Nevada', rate: 0, type: 'none', noTax: true, notes: 'No state income tax — capital gains tax-free', brackets: 'None', topRate: 0 },
  { abbr: 'NH', name: 'New Hampshire', rate: 0, type: 'none', noTax: true, notes: 'No tax on earned income or capital gains (interest/dividends tax repealed 2025)', brackets: 'None', topRate: 0 },
  { abbr: 'NJ', name: 'New Jersey', rate: 10.75, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; very high top rate', brackets: '1.4-10.75%', topRate: 10.75 },
  { abbr: 'NM', name: 'New Mexico', rate: 5.9, type: 'progressive', noTax: false, notes: 'Capital gains deduction of up to $1,000 for NM-source gains', brackets: '1.7-5.9%', topRate: 5.9 },
  { abbr: 'NY', name: 'New York', rate: 10.9, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; NYC adds 3.876% on top', brackets: '4-10.9%', topRate: 10.9 },
  { abbr: 'NC', name: 'North Carolina', rate: 4.5, type: 'flat', noTax: false, notes: 'Flat 4.5% tax on all income including capital gains (rate declining)', brackets: '4.5% flat', topRate: 4.5 },
  { abbr: 'ND', name: 'North Dakota', rate: 2.5, type: 'progressive', noTax: false, notes: 'Very low rates — among the cheapest states for capital gains', brackets: '0-2.5%', topRate: 2.5 },
  { abbr: 'OH', name: 'Ohio', rate: 3.5, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '0-3.5%', topRate: 3.5 },
  { abbr: 'OK', name: 'Oklahoma', rate: 4.75, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '0.25-4.75%', topRate: 4.75 },
  { abbr: 'OR', name: 'Oregon', rate: 9.9, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; very high top rate, no sales tax', brackets: '4.75-9.9%', topRate: 9.9 },
  { abbr: 'PA', name: 'Pennsylvania', rate: 3.07, type: 'flat', noTax: false, notes: 'Flat 3.07% tax on all income including capital gains (one of lowest)', brackets: '3.07% flat', topRate: 3.07 },
  { abbr: 'RI', name: 'Rhode Island', rate: 5.99, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '3.75-5.99%', topRate: 5.99 },
  { abbr: 'SC', name: 'South Carolina', rate: 6.4, type: 'progressive', noTax: false, notes: '44% deduction on net capital gains (effective max rate ~3.6%)', brackets: '0-6.4%', topRate: 6.4 },
  { abbr: 'SD', name: 'South Dakota', rate: 0, type: 'none', noTax: true, notes: 'No state income tax — capital gains tax-free', brackets: 'None', topRate: 0 },
  { abbr: 'TN', name: 'Tennessee', rate: 0, type: 'none', noTax: true, notes: 'No state income tax — capital gains tax-free', brackets: 'None', topRate: 0 },
  { abbr: 'TX', name: 'Texas', rate: 0, type: 'none', noTax: true, notes: 'No state income tax — capital gains tax-free', brackets: 'None', topRate: 0 },
  { abbr: 'UT', name: 'Utah', rate: 4.65, type: 'flat', noTax: false, notes: 'Flat 4.65% tax on all income including capital gains', brackets: '4.65% flat', topRate: 4.65 },
  { abbr: 'VT', name: 'Vermont', rate: 8.75, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; high top rate', brackets: '3.35-8.75%', topRate: 8.75 },
  { abbr: 'VA', name: 'Virginia', rate: 5.75, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income at graduated rates', brackets: '2-5.75%', topRate: 5.75 },
  { abbr: 'WA', name: 'Washington', rate: 7.0, type: 'special', noTax: false, notes: '7% excise tax on capital gains over $270K (enacted 2022, upheld by courts)', brackets: '7% over $270K', topRate: 7.0 },
  { abbr: 'WV', name: 'West Virginia', rate: 5.12, type: 'progressive', noTax: false, notes: 'Capital gains taxed as ordinary income; rates being reduced', brackets: '3-5.12%', topRate: 5.12 },
  { abbr: 'WI', name: 'Wisconsin', rate: 7.65, type: 'progressive', noTax: false, notes: '60% exclusion on gains from qualified WI small business stock', brackets: '3.5-7.65%', topRate: 7.65 },
  { abbr: 'WY', name: 'Wyoming', rate: 0, type: 'none', noTax: true, notes: 'No state income tax — capital gains tax-free', brackets: 'None', topRate: 0 },
];

// Federal long-term brackets 2026 (estimated)
const fedBracketsSingle = [
  { min: 0, max: 47025, rate: 0 },
  { min: 47025, max: 518900, rate: 15 },
  { min: 518900, max: Infinity, rate: 20 },
];
const fedBracketsMFJ = [
  { min: 0, max: 94050, rate: 0 },
  { min: 94050, max: 583750, rate: 15 },
  { min: 583750, max: Infinity, rate: 20 },
];

const noTaxStates = states.filter(s => s.noTax).map(s => s.name);

function slug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function buildStatePage(st) {
  const stSlug = slug(st.name);
  const isNoTax = st.noTax;
  const otherStates = states.filter(s => s.abbr !== st.abbr).sort(() => Math.random() - 0.5).slice(0, 8);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${st.name} Capital Gains Tax Calculator 2026 | CalcLeap</title>
<meta name="description" content="Free ${st.name} capital gains tax calculator. Calculate federal + ${st.abbr} state tax on investment gains, stocks, crypto, and real estate sales for 2026.">
<link rel="canonical" href="https://calcleap.com/capital-gains/${stSlug}.html">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebApplication","name":"${st.name} Capital Gains Tax Calculator","description":"Calculate federal and ${st.name} state capital gains tax on investment gains.","url":"https://calcleap.com/capital-gains/${stSlug}.html","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"isPartOf":{"@type":"WebSite","name":"CalcLeap","url":"https://calcleap.com"}}
</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#f5f5f7;--white:#fff;--text:#1d1d1f;--text2:#424245;--text3:#86868b;--accent:#0071e3;--border:rgba(0,0,0,.08);--shadow:0 2px 12px rgba(0,0,0,.06);--r:16px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}
a{color:inherit;text-decoration:none}
.nav{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}
.logo{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}.logo span{color:var(--accent)}
.nav-links{display:flex;gap:.15rem}
.nav-links a{font-size:.8rem;color:var(--text3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}
.nav-links a:hover{color:var(--text);background:rgba(0,0,0,.04)}
.page{max-width:var(--mw);margin:0 auto;padding:0 2rem}
.breadcrumb{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text3)}
.breadcrumb a{color:var(--text2)}.breadcrumb a:hover{color:var(--accent)}
.breadcrumb .sep{margin:0 .35rem;opacity:.4}
.page-title{font-size:2.1rem;font-weight:700;letter-spacing:-.03em;line-height:1.15;margin-bottom:.5rem}
.subtitle{font-size:1.05rem;color:var(--text2);margin-bottom:2rem;max-width:650px}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.card h2{font-size:1.15rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.form-group{display:flex;flex-direction:column;gap:.3rem}
.form-group label{font-size:.78rem;font-weight:600;color:var(--text2);letter-spacing:.02em;text-transform:uppercase}
.form-group input,.form-group select{padding:.7rem .85rem;font-size:.95rem;font-family:var(--font);background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);outline:none;transition:all .2s}
.form-group input:focus,.form-group select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1);background:var(--white)}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:12px;cursor:pointer;transition:all .2s;margin-top:.5rem;width:100%}
.btn:hover{background:#0077ED;box-shadow:0 4px 12px rgba(0,113,227,.3)}
.result-area{display:none;margin-top:1.5rem;animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem}
.result-card{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:1.25rem;text-align:center}
.result-card .lbl{font-size:.75rem;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.3rem}
.result-card .val{font-size:1.5rem;font-weight:700;letter-spacing:-.02em}
.result-card .val.green{color:#34c759}.result-card .val.red{color:#ff3b30}.result-card .val.blue{color:var(--accent)}
.bar-chart{margin:1.5rem 0}
.bar-row{display:flex;align-items:center;gap:.75rem;margin-bottom:.65rem}
.bar-label{width:120px;font-size:.8rem;font-weight:600;color:var(--text2);text-align:right;flex-shrink:0}
.bar-track{flex:1;height:28px;background:var(--bg);border-radius:8px;overflow:hidden;position:relative}
.bar-fill{height:100%;border-radius:8px;transition:width .6s ease;display:flex;align-items:center;padding:0 10px}
.bar-fill span{font-size:.72rem;font-weight:700;color:#fff;white-space:nowrap}
.bar-fed{background:linear-gradient(90deg,#0071e3,#34aadc)}
.bar-state{background:linear-gradient(90deg,#5856d6,#af52de)}
.bar-niit{background:linear-gradient(90deg,#ff9500,#ff6b00)}
.bar-net{background:linear-gradient(90deg,#34c759,#30d158)}
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.info-card h2{font-size:1.15rem;font-weight:700;margin-bottom:1rem}
.info-card h3{font-size:1rem;font-weight:700;margin:1.25rem 0 .5rem}
.info-card p,.info-card li{font-size:.92rem;color:var(--text2);line-height:1.7}
.info-card ul{padding-left:1.25rem;margin:.5rem 0}
.info-card li{margin-bottom:.35rem}
.stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:1.25rem 0}
.stat-card{background:var(--bg);border-radius:12px;padding:1rem;text-align:center}
.stat-card .val{font-size:1.35rem;font-weight:700;color:var(--accent)}
.stat-card .lbl{font-size:.75rem;color:var(--text3);margin-top:.2rem}
.faq{margin-top:1.5rem}
.faq details{border-bottom:1px solid var(--border);padding:1rem 0}
.faq summary{font-weight:600;font-size:.95rem;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center}
.faq summary::after{content:'+';font-size:1.2rem;color:var(--text3);transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq .answer{padding:.75rem 0 .25rem;font-size:.9rem;color:var(--text2);line-height:1.7}
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.6rem;margin:1rem 0}
.state-link{display:block;padding:.6rem .85rem;background:var(--bg);border:1px solid var(--border);border-radius:8px;font-size:.82rem;font-weight:500;color:var(--text2);transition:all .15s}
.state-link:hover{border-color:var(--accent);color:var(--accent);background:rgba(0,113,227,.04)}
ins{display:block;margin:20px auto;border-radius:12px;overflow:hidden}
.footer{background:#1d1d1f;color:#86868b;padding:40px 20px;margin-top:60px}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:2rem}
.footer h5{color:#f5f5f7;margin-bottom:.75rem;font-size:.85rem}
.footer a{display:block;color:#86868b;font-size:.82rem;margin-bottom:.4rem;transition:color .15s}
.footer a:hover{color:#2997ff}
.footer-bottom{text-align:center;margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);font-size:.78rem}
@media(max-width:600px){.form-row{grid-template-columns:1fr}.page-title{font-size:1.65rem}.result-grid{grid-template-columns:1fr 1fr}.bar-label{width:80px;font-size:.72rem}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a class="logo" href="../index.html">Calc<span>Leap</span></a><div class="nav-links"><a href="../index.html">Home</a><a href="../index.html#finance">Finance</a><a href="../index.html#insurance">Insurance</a></div></div></nav>

<div class="page">
<div class="breadcrumb"><a href="../index.html">Home</a><span class="sep">›</span><a href="index.html">Capital Gains Tax</a><span class="sep">›</span>${st.name}</div>

<h1 class="page-title">${st.name} Capital Gains Tax Calculator 2026</h1>
<p class="subtitle">Calculate your combined federal + ${st.abbr} state capital gains tax on stocks, crypto, real estate, and other investments. ${isNoTax ? `${st.name} has no state income tax — you only pay federal capital gains tax.` : `${st.name} taxes capital gains at rates up to ${st.topRate}%.`}</p>



<div class="card">
<h2>📊 Calculate Your ${st.name} Capital Gains Tax</h2>
<div class="form-row">
  <div class="form-group"><label>Purchase Price ($)</label><input type="number" id="purchase" placeholder="10,000" value="50000"></div>
  <div class="form-group"><label>Sale Price ($)</label><input type="number" id="sale" placeholder="75,000" value="100000"></div>
</div>
<div class="form-row">
  <div class="form-group"><label>Filing Status</label><select id="filing">
    <option value="single">Single</option>
    <option value="mfj">Married Filing Jointly</option>
    <option value="mfs">Married Filing Separately</option>
    <option value="hoh">Head of Household</option>
  </select></div>
  <div class="form-group"><label>Holding Period</label><select id="holding">
    <option value="long">Long-term (1+ years)</option>
    <option value="short">Short-term (&lt;1 year)</option>
  </select></div>
</div>
<div class="form-row">
  <div class="form-group"><label>Other Taxable Income ($)</label><input type="number" id="income" placeholder="75,000" value="75000"></div>
  <div class="form-group"><label>Investment Losses ($)</label><input type="number" id="losses" placeholder="0" value="0"></div>
</div>
<button class="btn" onclick="calculate()">Calculate Capital Gains Tax</button>

<div class="result-area" id="results">
  <div class="result-grid">
    <div class="result-card"><div class="lbl">Capital Gain</div><div class="val blue" id="r-gain">—</div></div>
    <div class="result-card"><div class="lbl">Federal Tax</div><div class="val red" id="r-fed">—</div></div>
    <div class="result-card"><div class="lbl">${st.abbr} State Tax</div><div class="val red" id="r-state">—</div></div>
    <div class="result-card"><div class="lbl">NIIT (3.8%)</div><div class="val red" id="r-niit">—</div></div>
    <div class="result-card"><div class="lbl">Total Tax</div><div class="val red" id="r-total">—</div></div>
    <div class="result-card"><div class="lbl">After-Tax Proceeds</div><div class="val green" id="r-net">—</div></div>
  </div>
  <div class="bar-chart" id="bar-chart"></div>
  <div class="result-grid" style="margin-top:1rem">
    <div class="result-card"><div class="lbl">Effective Fed Rate</div><div class="val" id="r-fedrate">—</div></div>
    <div class="result-card"><div class="lbl">Effective State Rate</div><div class="val" id="r-staterate">—</div></div>
    <div class="result-card"><div class="lbl">Combined Effective Rate</div><div class="val" id="r-combrate">—</div></div>
  </div>
</div>
</div>



<div class="info-card">
<h2>📋 ${st.name} Capital Gains Tax Overview</h2>
<div class="stat-row">
  <div class="stat-card"><div class="val">${isNoTax ? '0%' : st.topRate + '%'}</div><div class="lbl">State CG Rate</div></div>
  <div class="stat-card"><div class="val">${st.brackets}</div><div class="lbl">Rate Structure</div></div>
  <div class="stat-card"><div class="val">20%</div><div class="lbl">Max Federal Rate</div></div>
  <div class="stat-card"><div class="val">3.8%</div><div class="lbl">NIIT Surcharge</div></div>
</div>
<p style="margin-top:1rem">${st.notes}</p>

<h3>How Capital Gains Tax Works in ${st.name}</h3>
<p>When you sell an investment — stocks, bonds, cryptocurrency, real estate, or other assets — for more than you paid, the profit is a <strong>capital gain</strong>. ${isNoTax ? `Since ${st.name} has no state income tax, you'll only owe federal capital gains tax on your profits, making it one of the most tax-friendly states for investors.` : `In ${st.name}, capital gains are ${st.type === 'special' ? 'taxed under special rules' : 'generally taxed as ordinary income'} at rates up to ${st.topRate}%, on top of federal capital gains tax.`}</p>

<h3>Federal Capital Gains Tax Rates (2026)</h3>
<ul>
<li><strong>0% rate:</strong> Single filers with taxable income up to $47,025 (MFJ: $94,050)</li>
<li><strong>15% rate:</strong> Single filers $47,025–$518,900 (MFJ: $94,050–$583,750)</li>
<li><strong>20% rate:</strong> Single filers above $518,900 (MFJ: above $583,750)</li>
<li><strong>3.8% NIIT:</strong> Net Investment Income Tax applies to income above $200K (single) or $250K (MFJ)</li>
</ul>

<h3>Short-Term vs. Long-Term Capital Gains</h3>
<p><strong>Short-term gains</strong> (assets held less than 1 year) are taxed at your ordinary income tax rate — which can be as high as 37% federally${isNoTax ? '' : ` plus ${st.topRate}% in ${st.name}`}. <strong>Long-term gains</strong> (assets held 1+ years) receive preferential federal rates of 0%, 15%, or 20%${isNoTax ? '.' : `, but ${st.name} ${st.type === 'special' ? 'has special rules for capital gains taxation.' : 'does not offer a preferential state rate — gains are taxed as ordinary income.'}`}</p>

<h3>5 Strategies to Reduce Capital Gains Tax in ${st.name}</h3>
<ul>
<li><strong>Hold investments for 1+ years</strong> — Long-term gains qualify for 0/15/20% federal rates instead of up to 37%</li>
<li><strong>Tax-loss harvesting</strong> — Sell losing investments to offset gains (up to $3,000 excess losses deductible)</li>
<li><strong>Use tax-advantaged accounts</strong> — 401(k), IRA, Roth IRA, HSA shield gains from taxation</li>
<li><strong>Qualified Opportunity Zones</strong> — Defer and potentially reduce capital gains by investing in QOZ funds</li>
<li><strong>${isNoTax ? 'Stay in a no-tax state' : 'Consider your timing'}</strong> — ${isNoTax ? `Living in ${st.name} already saves you state tax on all capital gains` : `Sell in years when your income is lower to stay in a lower federal bracket`}</li>
</ul>
${isNoTax ? `
<h3>Why Investors Choose ${st.name}</h3>
<p>${st.name} is one of only ${noTaxStates.length} states with no state income tax, making it a top destination for investors, retirees, and high-net-worth individuals looking to minimize their tax burden on investment gains. While you still owe federal capital gains tax, the state tax savings can be substantial — especially for large gains from stock sales, business exits, or real estate transactions.</p>` : `
<h3>${st.name}-Specific Capital Gains Rules</h3>
<p>${st.notes}. Combined with federal rates, investors in ${st.name} could pay up to ${(23.8 + st.topRate).toFixed(1)}% on long-term gains or up to ${(40.8 + st.topRate).toFixed(1)}% on short-term gains. Tax planning is essential for ${st.name} residents with significant investment income.</p>`}
</div>

<div class="info-card">
<h2>❓ Frequently Asked Questions</h2>
<div class="faq">
<details><summary>What is the capital gains tax rate in ${st.name}?</summary><div class="answer">${isNoTax ? `${st.name} has no state income tax, so there is no state capital gains tax. You only pay federal capital gains tax at 0%, 15%, or 20% depending on your income level, plus potentially the 3.8% Net Investment Income Tax.` : `${st.name} taxes capital gains at rates up to ${st.topRate}%. ${st.notes}. Combined with federal tax (0-20%) and the potential 3.8% NIIT, your total rate could reach ${(23.8 + st.topRate).toFixed(1)}%.`}</div></details>
<details><summary>How do I calculate capital gains tax on stocks in ${st.name}?</summary><div class="answer">Subtract your cost basis (purchase price + fees) from your sale price to determine your gain. If held over 1 year, apply federal long-term rates (0/15/20% based on income)${isNoTax ? '. No state tax applies.' : ` plus ${st.name}'s state rate (up to ${st.topRate}%).`} Our calculator above handles all of this automatically.</div></details>
<details><summary>Does ${st.name} tax cryptocurrency capital gains?</summary><div class="answer">Yes — cryptocurrency is treated as property by the IRS and ${isNoTax ? `most states. However, since ${st.name} has no income tax, you only pay federal capital gains tax on crypto profits.` : `by ${st.name}. Crypto gains are taxed the same as stocks or other investments — at your ordinary income tax rate for short-term gains or preferential federal rates for long-term gains, plus the ${st.name} state rate of up to ${st.topRate}%.`}</div></details>
<details><summary>Is there a capital gains exclusion for home sales in ${st.name}?</summary><div class="answer">Yes — the federal home sale exclusion allows you to exclude up to $250,000 in gains ($500,000 for married couples filing jointly) if you've lived in the home for at least 2 of the last 5 years. This exclusion applies to ${isNoTax ? 'federal taxes. Since ' + st.name + ' has no income tax, no state tax applies either.' : 'both federal and ' + st.name + ' state taxes. Gains above the exclusion limit are taxed at your applicable rates.'}</div></details>
<details><summary>What is the Net Investment Income Tax (NIIT)?</summary><div class="answer">The NIIT is a 3.8% federal surtax on investment income (capital gains, dividends, interest, rental income) for individuals with modified AGI above $200,000 (single) or $250,000 (married filing jointly). It applies in all states, including ${st.name}.</div></details>
<details><summary>How can I reduce my capital gains tax in ${st.name}?</summary><div class="answer">Key strategies include: holding investments for over 1 year (lower federal rate), tax-loss harvesting (offsetting gains with losses), using tax-advantaged accounts (401k, IRA, Roth), donating appreciated assets to charity (avoid gains entirely), and timing your sales to stay in lower tax brackets.${isNoTax ? ` Living in ${st.name} already eliminates state capital gains tax.` : ''}</div></details>
</div>
</div>



<div class="info-card">
<h2>🗺️ Compare Capital Gains Tax by State</h2>
<div class="state-grid">
${otherStates.map(s => `<a class="state-link" href="${slug(s.name)}.html">${s.name} — ${s.noTax ? '0%' : s.topRate + '%'}</a>`).join('\n')}
<a class="state-link" href="index.html" style="border-color:var(--accent);color:var(--accent)">View All 50 States →</a>
</div>
</div>
</div>

<footer class="footer"><div class="footer-inner">
<div><a class="logo" href="../index.html" style="color:#f5f5f7">Calc<span>Leap</span></a><p style="margin-top:.4rem">Fast, beautiful, private calculators.</p></div>
<div><h5>Popular</h5><a href="../bmi-calculator.html">BMI Calculator</a><a href="../calc/mortgage-payment.html">Mortgage</a><a href="../income-tax-calculator.html">Income Tax</a></div>
<div><h5>Categories</h5><a href="../index.html#finance">Financial</a><a href="../index.html#insurance">Insurance</a><a href="../index.html#health">Health</a></div>
<div><h5>Company</h5><a href="../about.html">About</a><a href="../privacy.html">Privacy</a><a href="../contact.html">Contact</a></div>
</div><div class="footer-bottom"><p>© 2026 CalcLeap. For informational purposes only. Not tax advice — consult a qualified tax professional.</p></div></footer>

<script>
const stateRate = ${st.topRate};
const isNoTax = ${isNoTax};
const stateType = '${st.type}';

function fmt(n){return '$'+Math.round(n).toLocaleString()}
function pct(n){return n.toFixed(1)+'%'}

function calculate(){
  const purchase = parseFloat(document.getElementById('purchase').value)||0;
  const sale = parseFloat(document.getElementById('sale').value)||0;
  const filing = document.getElementById('filing').value;
  const holding = document.getElementById('holding').value;
  const otherIncome = parseFloat(document.getElementById('income').value)||0;
  const losses = parseFloat(document.getElementById('losses').value)||0;

  let gain = sale - purchase - Math.min(losses, sale - purchase);
  if(gain < 0) gain = 0;
  const netLoss = Math.min(losses - Math.max(0, sale - purchase - losses), 3000);

  // Federal tax
  let fedTax = 0;
  const totalIncome = otherIncome + gain;
  
  if(holding === 'long'){
    // Long-term capital gains rates
    const brackets = filing === 'mfj' ? 
      [{max:94050,rate:0},{max:583750,rate:.15},{max:Infinity,rate:.20}] :
      [{max:47025,rate:0},{max:518900,rate:.15},{max:Infinity,rate:.20}];
    
    let remaining = gain;
    let taxableStart = otherIncome;
    for(const b of brackets){
      if(taxableStart >= b.max){continue;}
      const space = b.max - taxableStart;
      const taxable = Math.min(remaining, space);
      fedTax += taxable * b.rate;
      remaining -= taxable;
      taxableStart += taxable;
      if(remaining <= 0) break;
    }
  } else {
    // Short-term = ordinary income rates
    const brackets = filing === 'mfj' ?
      [{max:23200,rate:.10},{max:94300,rate:.12},{max:201050,rate:.22},{max:383900,rate:.24},{max:487450,rate:.32},{max:731200,rate:.35},{max:Infinity,rate:.37}] :
      [{max:11600,rate:.10},{max:47150,rate:.12},{max:100525,rate:.22},{max:191950,rate:.24},{max:243725,rate:.32},{max:609350,rate:.35},{max:Infinity,rate:.37}];
    
    let remaining = gain;
    let taxableStart = otherIncome;
    for(const b of brackets){
      if(taxableStart >= b.max){continue;}
      const space = b.max - taxableStart;
      const taxable = Math.min(remaining, space);
      fedTax += taxable * b.rate;
      remaining -= taxable;
      taxableStart += taxable;
      if(remaining <= 0) break;
    }
  }

  // NIIT (3.8% on investment income if AGI > threshold)
  const niitThreshold = (filing === 'mfj') ? 250000 : 200000;
  let niit = 0;
  if(totalIncome > niitThreshold){
    const niitIncome = Math.min(gain, totalIncome - niitThreshold);
    niit = niitIncome * 0.038;
  }

  // State tax
  let stateTax = 0;
  if(!isNoTax){
    stateTax = gain * (stateRate / 100);
  }

  const totalTax = fedTax + stateTax + niit;
  const netProceeds = sale - totalTax - purchase;

  // Display results
  document.getElementById('results').style.display = 'block';
  document.getElementById('r-gain').textContent = fmt(gain);
  document.getElementById('r-fed').textContent = fmt(fedTax);
  document.getElementById('r-state').textContent = fmt(stateTax);
  document.getElementById('r-niit').textContent = fmt(niit);
  document.getElementById('r-total').textContent = fmt(totalTax);
  document.getElementById('r-net').textContent = fmt(sale - totalTax);
  document.getElementById('r-fedrate').textContent = gain > 0 ? pct(fedTax/gain*100) : '0%';
  document.getElementById('r-staterate').textContent = gain > 0 ? pct(stateTax/gain*100) : '0%';
  document.getElementById('r-combrate').textContent = gain > 0 ? pct(totalTax/gain*100) : '0%';

  // Bar chart
  const maxVal = Math.max(fedTax, stateTax, niit, sale - totalTax, 1);
  const chart = document.getElementById('bar-chart');
  chart.innerHTML = '<div class="bar-row"><div class="bar-label">Federal Tax</div><div class="bar-track"><div class="bar-fill bar-fed" style="width:'+Math.max(fedTax/maxVal*100,2)+'%"><span>'+fmt(fedTax)+'</span></div></div></div>'
    +'<div class="bar-row"><div class="bar-label">'+${JSON.stringify(st.abbr)}+' State Tax</div><div class="bar-track"><div class="bar-fill bar-state" style="width:'+Math.max(stateTax/maxVal*100,isNoTax?1:2)+'%"><span>'+fmt(stateTax)+'</span></div></div></div>'
    +'<div class="bar-row"><div class="bar-label">NIIT (3.8%)</div><div class="bar-track"><div class="bar-fill bar-niit" style="width:'+Math.max(niit/maxVal*100,1)+'%"><span>'+fmt(niit)+'</span></div></div></div>'
    +'<div class="bar-row"><div class="bar-label">After-Tax</div><div class="bar-track"><div class="bar-fill bar-net" style="width:'+Math.max((sale-totalTax)/maxVal*100,2)+'%"><span>'+fmt(sale-totalTax)+'</span></div></div></div>';
  
  document.getElementById('results').scrollIntoView({behavior:'smooth',block:'nearest'});
}

document.addEventListener('DOMContentLoaded', calculate);
</script>
</body>
</html>`;
}

// Build index page
function buildIndex() {
  const sorted = [...states].sort((a, b) => a.name.localeCompare(b.name));
  const noTaxList = sorted.filter(s => s.noTax);
  const highTax = sorted.filter(s => !s.noTax).sort((a, b) => b.topRate - a.topRate).slice(0, 5);
  const lowTax = sorted.filter(s => !s.noTax).sort((a, b) => a.topRate - b.topRate).slice(0, 5);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Capital Gains Tax Calculator by State 2026 | All 50 States | CalcLeap</title>
<meta name="description" content="Free capital gains tax calculators for all 50 US states. Compare state capital gains tax rates, find no-tax states, and calculate your federal + state tax on investments.">
<link rel="canonical" href="https://calcleap.com/capital-gains/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#f5f5f7;--white:#fff;--text:#1d1d1f;--text2:#424245;--text3:#86868b;--accent:#0071e3;--border:rgba(0,0,0,.08);--shadow:0 2px 12px rgba(0,0,0,.06);--r:16px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}
a{color:inherit;text-decoration:none}
.nav{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}
.logo{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}.logo span{color:var(--accent)}
.nav-links{display:flex;gap:.15rem}
.nav-links a{font-size:.8rem;color:var(--text3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}
.nav-links a:hover{color:var(--text);background:rgba(0,0,0,.04)}
.page{max-width:var(--mw);margin:0 auto;padding:0 2rem}
.breadcrumb{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text3)}
.breadcrumb a{color:var(--text2)}.breadcrumb a:hover{color:var(--accent)}
.page-title{font-size:2.1rem;font-weight:700;letter-spacing:-.03em;line-height:1.15;margin-bottom:.5rem}
.subtitle{font-size:1.05rem;color:var(--text2);margin-bottom:2rem;max-width:650px}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.card h2{font-size:1.15rem;font-weight:700;margin-bottom:1rem}
.search{width:100%;padding:.8rem 1.1rem;font-size:.95rem;font-family:var(--font);border:1px solid var(--border);border-radius:10px;background:var(--bg);outline:none;margin-bottom:1.25rem}
.search:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1)}
.highlights{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-bottom:2rem}
.highlight{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem;box-shadow:var(--shadow)}
.highlight h3{font-size:.95rem;font-weight:700;margin-bottom:.75rem}
.highlight ul{list-style:none;padding:0}
.highlight li{padding:.35rem 0;font-size:.88rem;color:var(--text2);display:flex;justify-content:space-between}
.highlight li .rate{font-weight:700;color:var(--accent)}
.highlight li .rate.green{color:#34c759}
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem}
.state-card{display:block;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:1.15rem;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:all .2s}
.state-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.1);border-color:var(--accent)}
.state-card .name{font-weight:700;font-size:.95rem;margin-bottom:.2rem}
.state-card .rate{font-size:.85rem;color:var(--accent);font-weight:600}
.state-card .badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:.7rem;font-weight:700;margin-top:.3rem}
.badge-notax{background:#e8f5e9;color:#2e7d32}
.badge-high{background:#fce4ec;color:#c62828}
.badge-low{background:#e3f2fd;color:#1565c0}
ins{display:block;margin:20px auto;border-radius:12px;overflow:hidden}
.footer{background:#1d1d1f;color:#86868b;padding:40px 20px;margin-top:60px}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:2rem}
.footer h5{color:#f5f5f7;margin-bottom:.75rem;font-size:.85rem}
.footer a{display:block;color:#86868b;font-size:.82rem;margin-bottom:.4rem}
.footer a:hover{color:#2997ff}
.footer-bottom{text-align:center;margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);font-size:.78rem}
@media(max-width:600px){.page-title{font-size:1.65rem}.state-grid{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a class="logo" href="../index.html">Calc<span>Leap</span></a><div class="nav-links"><a href="../index.html">Home</a><a href="../index.html#finance">Finance</a><a href="../index.html#insurance">Insurance</a></div></div></nav>

<div class="page">
<div class="breadcrumb"><a href="../index.html">Home</a><span class="sep" style="margin:0 .35rem;opacity:.4">›</span>Capital Gains Tax by State</div>

<h1 class="page-title">Capital Gains Tax Calculator by State 2026</h1>
<p class="subtitle">Compare capital gains tax rates across all 50 states. Find no-tax states, calculate your federal + state tax on stocks, crypto, and real estate gains.</p>



<div class="highlights">
<div class="highlight">
<h3>🟢 No Capital Gains Tax (${noTaxList.length} States)</h3>
<ul>${noTaxList.map(s => `<li><a href="${slug(s.name)}.html">${s.name}</a><span class="rate green">0%</span></li>`).join('')}</ul>
</div>
<div class="highlight">
<h3>🔴 Highest Capital Gains Tax</h3>
<ul>${highTax.map(s => `<li><a href="${slug(s.name)}.html">${s.name}</a><span class="rate">${s.topRate}%</span></li>`).join('')}</ul>
</div>
<div class="highlight">
<h3>🔵 Lowest Capital Gains Tax (with income tax)</h3>
<ul>${lowTax.map(s => `<li><a href="${slug(s.name)}.html">${s.name}</a><span class="rate">${s.topRate}%</span></li>`).join('')}</ul>
</div>
</div>

<div class="card">
<h2>All 50 States — Capital Gains Tax Rates</h2>
<input type="text" class="search" id="search" placeholder="Search states..." oninput="filterStates()">
<div class="state-grid" id="grid">
${sorted.map(s => {
  const badge = s.noTax ? '<div class="badge badge-notax">No Tax</div>' :
    s.topRate >= 9 ? '<div class="badge badge-high">High Tax</div>' :
    s.topRate <= 3.5 ? '<div class="badge badge-low">Low Tax</div>' : '';
  return `<a class="state-card" href="${slug(s.name)}.html" data-name="${s.name.toLowerCase()}"><div class="name">${s.name}</div><div class="rate">${s.noTax ? 'No State Tax' : 'Up to ' + s.topRate + '%'}</div>${badge}</a>`;
}).join('\n')}
</div>
</div>



<div class="card">
<h2>📋 Understanding Capital Gains Tax</h2>
<p style="font-size:.92rem;color:var(--text2);line-height:1.7;margin-bottom:1rem">Capital gains tax is levied on profits from selling investments like stocks, bonds, cryptocurrency, real estate, and other assets. The tax rate depends on how long you held the asset and your income level.</p>
<p style="font-size:.92rem;color:var(--text2);line-height:1.7;margin-bottom:1rem"><strong>Short-term gains</strong> (held &lt;1 year) are taxed at ordinary income rates (10-37% federally). <strong>Long-term gains</strong> (held 1+ years) get preferential rates of 0%, 15%, or 20% federally.</p>
<p style="font-size:.92rem;color:var(--text2);line-height:1.7;margin-bottom:1rem">On top of federal tax, most states also tax capital gains. ${noTaxList.length} states have no income tax at all, making them the most tax-friendly for investors. States like California (13.3%), New Jersey (10.75%), and New York (10.9%) have the highest combined rates.</p>
<p style="font-size:.92rem;color:var(--text2);line-height:1.7">The <strong>Net Investment Income Tax (NIIT)</strong> adds 3.8% for high earners (AGI above $200K single / $250K married), bringing the maximum federal rate to 23.8%.</p>
</div>
</div>

<footer class="footer"><div class="footer-inner">
<div><a class="logo" href="../index.html" style="color:#f5f5f7">Calc<span>Leap</span></a><p style="margin-top:.4rem">Fast, beautiful, private calculators.</p></div>
<div><h5>Popular</h5><a href="../bmi-calculator.html">BMI Calculator</a><a href="../calc/mortgage-payment.html">Mortgage</a><a href="../income-tax-calculator.html">Income Tax</a></div>
<div><h5>Categories</h5><a href="../index.html#finance">Financial</a><a href="../index.html#insurance">Insurance</a><a href="../index.html#health">Health</a></div>
<div><h5>Company</h5><a href="../about.html">About</a><a href="../privacy.html">Privacy</a><a href="../contact.html">Contact</a></div>
</div><div class="footer-bottom"><p>© 2026 CalcLeap. For informational purposes only. Not tax advice.</p></div></footer>

<script>
function filterStates(){
  const q = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('.state-card').forEach(c => {
    c.style.display = c.dataset.name.includes(q) ? '' : 'none';
  });
}
</script>
</body>
</html>`;
}

// Generate all files
console.log('Building capital gains tax calculator pages...');

// Build index
fs.writeFileSync(path.join(dir, 'index.html'), buildIndex());
console.log('✅ index.html');

// Build state pages
for (const st of states) {
  const filename = slug(st.name) + '.html';
  fs.writeFileSync(path.join(dir, filename), buildStatePage(st));
  console.log(`✅ ${filename}`);
}

console.log(`\n🎉 Built ${states.length + 1} capital gains tax calculator pages!`);
