#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const states = [
  { abbr:'AL',name:'Alabama',avg:1680,median:157100,rate:.0042,wind:'High (hurricanes)',flood:'Moderate',hail:'High',fire:'Low',deductible:1500,factors:'Hurricane & tornado risk along the Gulf Coast'},
  { abbr:'AK',name:'Alaska',avg:1290,median:303600,rate:.0032,wind:'Low',flood:'Low',hail:'Low',fire:'Moderate',deductible:1000,factors:'Earthquake risk, extreme cold, remote location'},
  { abbr:'AZ',name:'Arizona',avg:1780,median:366500,rate:.0038,wind:'Low',flood:'Low (flash floods)',hail:'Moderate',fire:'High',deductible:1000,factors:'Wildfire risk, monsoon flooding, extreme heat'},
  { abbr:'AR',name:'Arkansas',avg:2120,median:162400,rate:.0054,wind:'High (tornadoes)',flood:'Moderate',hail:'High',fire:'Low',deductible:1500,factors:'Tornado Alley location, severe storms'},
  { abbr:'CA',name:'California',avg:1560,median:659300,rate:.0028,wind:'Low',flood:'Low',hail:'Low',fire:'Very High',deductible:1000,factors:'Wildfire risk is #1 concern, earthquake not covered by standard policies'},
  { abbr:'CO',name:'Colorado',avg:2700,median:436800,rate:.0048,wind:'Moderate',flood:'Moderate',hail:'Very High',fire:'High',deductible:2000,factors:'Hailstorm capital of the US, wildfire risk in mountain areas'},
  { abbr:'CT',name:'Connecticut',avg:1830,median:315600,rate:.0042,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'Low',deductible:1500,factors:'Coastal windstorm risk, nor\'easters, older housing stock'},
  { abbr:'DE',name:'Delaware',avg:1120,median:290800,rate:.0032,wind:'Moderate',flood:'High (coastal)',hail:'Low',fire:'Low',deductible:1000,factors:'Coastal flooding, hurricane risk, sea-level rise'},
  { abbr:'FL',name:'Florida',avg:4231,median:378300,rate:.0085,wind:'Very High',flood:'Very High',hail:'Low',fire:'Moderate',deductible:3000,factors:'Hurricane capital of the US, flood zones, sinkholes in central FL'},
  { abbr:'GA',name:'Georgia',avg:1740,median:275200,rate:.0045,wind:'High',flood:'Moderate',hail:'High',fire:'Low',deductible:1500,factors:'Hurricane risk on the coast, tornadoes inland, severe hail'},
  { abbr:'HI',name:'Hawaii',avg:1220,median:708600,rate:.0025,wind:'High (hurricanes)',flood:'Moderate',hail:'Low',fire:'Low (lava)',deductible:1000,factors:'Hurricane risk, volcanic activity, high construction costs'},
  { abbr:'ID',name:'Idaho',avg:1240,median:369300,rate:.0032,wind:'Low',flood:'Low',hail:'Moderate',fire:'High',deductible:1000,factors:'Wildfire risk in forested areas, rural access challenges'},
  { abbr:'IL',name:'Illinois',avg:1710,median:239900,rate:.0048,wind:'Moderate',flood:'Moderate',hail:'High',fire:'Low',deductible:1500,factors:'Severe thunderstorms, tornadoes, harsh winters'},
  { abbr:'IN',name:'Indiana',avg:1520,median:192300,rate:.0049,wind:'Moderate',flood:'Moderate',hail:'High',fire:'Low',deductible:1500,factors:'Tornado risk, severe thunderstorms, hail damage'},
  { abbr:'IA',name:'Iowa',avg:1650,median:181900,rate:.0052,wind:'High',flood:'High (river)',hail:'Very High',fire:'Low',deductible:1500,factors:'Severe hailstorms, river flooding, straight-line winds'},
  { abbr:'KS',name:'Kansas',avg:2960,median:193900,rate:.0062,wind:'Very High',flood:'Moderate',hail:'Very High',fire:'Moderate',deductible:2000,factors:'Heart of Tornado Alley, extreme hail events, straight-line winds'},
  { abbr:'KY',name:'Kentucky',avg:1890,median:173400,rate:.0054,wind:'Moderate',flood:'High',hail:'Moderate',fire:'Low',deductible:1500,factors:'Flash flooding, tornadoes, ice storms'},
  { abbr:'LA',name:'Louisiana',avg:3600,median:186400,rate:.0075,wind:'Very High',flood:'Very High',hail:'Moderate',fire:'Low',deductible:2500,factors:'Hurricane risk, extreme flooding, coastal erosion'},
  { abbr:'ME',name:'Maine',avg:1180,median:265000,rate:.0034,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'Low',deductible:1000,factors:'Nor\'easters, ice damage, older housing stock'},
  { abbr:'MD',name:'Maryland',avg:1530,median:369100,rate:.0034,wind:'Moderate',flood:'High (coastal)',hail:'Low',fire:'Low',deductible:1000,factors:'Hurricane/tropical storm risk on the coast, Chesapeake Bay flooding'},
  { abbr:'MA',name:'Massachusetts',avg:1860,median:531200,rate:.0032,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'Low',deductible:1500,factors:'Nor\'easters, coastal flooding, historic homes'},
  { abbr:'MI',name:'Michigan',avg:1520,median:213300,rate:.0046,wind:'Moderate',flood:'Moderate',hail:'Moderate',fire:'Low',deductible:1500,factors:'Severe thunderstorms, heavy snowfall, ice damage'},
  { abbr:'MN',name:'Minnesota',avg:2110,median:286800,rate:.0050,wind:'High',flood:'Moderate',hail:'Very High',fire:'Low',deductible:1500,factors:'Severe hailstorms, tornadoes, extreme cold/ice damage'},
  { abbr:'MS',name:'Mississippi',avg:2280,median:146900,rate:.0068,wind:'Very High',flood:'High',hail:'Moderate',fire:'Low',deductible:2000,factors:'Hurricane risk on the coast, tornadoes, flooding'},
  { abbr:'MO',name:'Missouri',avg:1820,median:194700,rate:.0052,wind:'High',flood:'High',hail:'Very High',fire:'Low',deductible:1500,factors:'Tornado risk, severe hailstorms, river flooding'},
  { abbr:'MT',name:'Montana',avg:1840,median:345300,rate:.0040,wind:'Moderate',flood:'Low',hail:'High',fire:'Very High',deductible:1500,factors:'Wildfire risk, severe hailstorms, remote location'},
  { abbr:'NE',name:'Nebraska',avg:2740,median:213200,rate:.0058,wind:'High',flood:'Moderate',hail:'Very High',fire:'Moderate',deductible:2000,factors:'Extreme hailstorms, tornadoes, severe thunderstorms'},
  { abbr:'NV',name:'Nevada',avg:1310,median:383200,rate:.0030,wind:'Low',flood:'Low (flash)',hail:'Low',fire:'Moderate',deductible:1000,factors:'Flash flooding, wildfire near urban-wildland interface'},
  { abbr:'NH',name:'New Hampshire',avg:1180,median:330600,rate:.0030,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'Low',deductible:1000,factors:'Ice storms, nor\'easters, heavy snow loads'},
  { abbr:'NJ',name:'New Jersey',avg:1560,median:395800,rate:.0034,wind:'Moderate',flood:'High (coastal)',hail:'Low',fire:'Low',deductible:1500,factors:'Hurricane risk, coastal flooding, Sandy-era awareness'},
  { abbr:'NM',name:'New Mexico',avg:1760,median:252100,rate:.0046,wind:'Moderate',flood:'Low (flash)',hail:'High',fire:'High',deductible:1500,factors:'Wildfire risk, flash flooding, hailstorms'},
  { abbr:'NY',name:'New York',avg:1670,median:379100,rate:.0035,wind:'Moderate',flood:'High (coastal)',hail:'Low',fire:'Low',deductible:1500,factors:'Coastal storm risk, nor\'easters, urban housing density'},
  { abbr:'NC',name:'North Carolina',avg:1620,median:269400,rate:.0042,wind:'High (hurricanes)',flood:'High',hail:'Moderate',fire:'Low',deductible:1500,factors:'Hurricane risk on the coast, mountain area ice/wind'},
  { abbr:'ND',name:'North Dakota',avg:1990,median:217400,rate:.0052,wind:'High',flood:'High (river)',hail:'Very High',fire:'Moderate',deductible:1500,factors:'Severe hailstorms, river flooding, extreme cold'},
  { abbr:'OH',name:'Ohio',avg:1380,median:195200,rate:.0046,wind:'Moderate',flood:'Moderate',hail:'Moderate',fire:'Low',deductible:1000,factors:'Severe thunderstorms, tornadoes, lake-effect weather'},
  { abbr:'OK',name:'Oklahoma',avg:3400,median:175700,rate:.0072,wind:'Very High',flood:'Moderate',hail:'Very High',fire:'Moderate',deductible:2500,factors:'Tornado Alley epicenter, extreme hail, ice storms'},
  { abbr:'OR',name:'Oregon',avg:1180,median:421500,rate:.0026,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'High',deductible:1000,factors:'Wildfire risk, heavy rainfall, earthquake risk'},
  { abbr:'PA',name:'Pennsylvania',avg:1310,median:232100,rate:.0040,wind:'Moderate',flood:'High',hail:'Low',fire:'Low',deductible:1000,factors:'Flash flooding, winter storms, older housing stock'},
  { abbr:'RI',name:'Rhode Island',avg:1680,median:379200,rate:.0036,wind:'Moderate',flood:'High (coastal)',hail:'Low',fire:'Low',deductible:1500,factors:'Coastal hurricane risk, flooding, older homes'},
  { abbr:'SC',name:'South Carolina',avg:1800,median:250700,rate:.0048,wind:'High (hurricanes)',flood:'High',hail:'Moderate',fire:'Low',deductible:1500,factors:'Hurricane risk on the coast, severe thunderstorms'},
  { abbr:'SD',name:'South Dakota',avg:2300,median:207200,rate:.0056,wind:'High',flood:'Moderate',hail:'Very High',fire:'Moderate',deductible:2000,factors:'Extreme hailstorms, tornadoes, severe thunderstorms'},
  { abbr:'TN',name:'Tennessee',avg:1750,median:245700,rate:.0048,wind:'High (tornadoes)',flood:'High',hail:'Moderate',fire:'Low',deductible:1500,factors:'Tornado risk (Nashville corridor), flash flooding'},
  { abbr:'TX',name:'Texas',avg:3340,median:263900,rate:.0058,wind:'Very High',flood:'Very High',hail:'Very High',fire:'High',deductible:2500,factors:'Hurricane coast, hailstorm interior, tornado alley, wildfire risk — Texas has it all'},
  { abbr:'UT',name:'Utah',avg:1180,median:431700,rate:.0028,wind:'Low',flood:'Low',hail:'Moderate',fire:'Moderate',deductible:1000,factors:'Wildfire in mountain areas, earthquake risk, dry conditions'},
  { abbr:'VT',name:'Vermont',avg:1110,median:273600,rate:.0032,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'Low',deductible:1000,factors:'Ice storms, nor\'easters, remote locations, older housing'},
  { abbr:'VA',name:'Virginia',avg:1390,median:330600,rate:.0034,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'Low',deductible:1000,factors:'Hurricane risk in coastal areas, flooding in valleys'},
  { abbr:'WA',name:'Washington',avg:1130,median:498400,rate:.0024,wind:'Moderate',flood:'Moderate',hail:'Low',fire:'High',deductible:1000,factors:'Wildfire in eastern WA, earthquake risk, heavy rainfall'},
  { abbr:'WV',name:'West Virginia',avg:1360,median:135200,rate:.0052,wind:'Moderate',flood:'High',hail:'Low',fire:'Low',deductible:1000,factors:'Flash flooding, mine subsidence, ice/wind storms'},
  { abbr:'WI',name:'Wisconsin',avg:1470,median:238800,rate:.0044,wind:'Moderate',flood:'Moderate',hail:'High',fire:'Low',deductible:1500,factors:'Severe thunderstorms, hailstorms, harsh winters'},
  { abbr:'WY',name:'Wyoming',avg:1780,median:269600,rate:.0046,wind:'High',flood:'Low',hail:'High',fire:'High',deductible:1500,factors:'Extreme wind, hailstorms, wildfire risk, remote access'}
];

function slug(name) { return name.toLowerCase().replace(/\s+/g,'-'); }

function genStatePage(s) {
  const colors = ['#0071e3','#34c759','#ff9500','#ff3b30','#af52de','#5ac8fa'];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${s.name} Home Insurance Calculator — Estimate Your Premium | CalcLeap</title>
<meta name="description" content="Calculate your estimated home insurance premium in ${s.name}. Average annual premium: $${s.avg.toLocaleString()}. Compare coverage options, deductibles, and discounts.">
<link rel="canonical" href="https://calcleap.com/home-insurance/${slug(s.name)}-home-insurance-calculator.html">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<meta property="og:title" content="${s.name} Home Insurance Calculator — CalcLeap">
<meta property="og:description" content="Estimate your home insurance cost in ${s.name}. Free calculator with state-specific risk factors and discounts.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://calcleap.com/home-insurance/${slug(s.name)}-home-insurance-calculator.html">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${s.name} Home Insurance Calculator","description":"Calculate estimated home insurance premiums in ${s.name}","url":"https://calcleap.com/home-insurance/${slug(s.name)}-home-insurance-calculator.html","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
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
.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--accent)}.breadcrumb .sep{margin:0 .35rem;opacity:.4}
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
.result-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.25rem;text-align:center;transition:all .2s}
.result-box:hover{border-color:var(--accent);box-shadow:var(--shadow)}
.result-box.primary{border-color:rgba(0,113,227,.3);background:rgba(0,113,227,.04)}
.result-label{font-size:.72rem;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.35rem}
.result-val{font-size:1.6rem;font-weight:800;letter-spacing:-.03em;color:var(--text)}
.result-sub{font-size:.78rem;color:var(--text-3);margin-top:.25rem}
.chart-wrap{margin:1.5rem 0}
.bar-row{display:flex;align-items:center;gap:.75rem;margin-bottom:.65rem}
.bar-label{width:120px;font-size:.78rem;font-weight:600;color:var(--text-2);text-align:right;flex-shrink:0}
.bar-track{flex:1;height:28px;background:var(--bg);border-radius:6px;overflow:hidden;position:relative}
.bar-fill{height:100%;border-radius:6px;display:flex;align-items:center;padding:0 .75rem;font-size:.72rem;font-weight:700;color:#fff;transition:width .6s ease}
.bar-amount{font-size:.78rem;font-weight:600;color:var(--text-2);width:80px;text-align:right;flex-shrink:0}
.risk-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;margin:1rem 0}
.risk-item{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);padding:1rem;text-align:center}
.risk-icon{font-size:1.5rem;margin-bottom:.25rem}
.risk-type{font-size:.75rem;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.03em}
.risk-level{font-size:.9rem;font-weight:700;margin-top:.15rem}
.risk-low{color:#34c759}.risk-moderate{color:#ff9500}.risk-high{color:#ff3b30}.risk-very-high{color:#af1d33}
.ad-slot{margin:1.5rem 0}
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;margin-bottom:1.25rem;box-shadow:var(--shadow)}
.info-card h3{font-size:1rem;font-weight:700;letter-spacing:-.015em;margin-bottom:1rem}
.info-card p,.info-card li{font-size:.9rem;color:var(--text-2);line-height:1.6;margin-bottom:.5rem}
.info-card ul{padding-left:1.25rem}
table{width:100%;border-collapse:separate;border-spacing:0;font-size:.875rem}
th{background:var(--bg);font-weight:600;text-align:left;padding:.6rem .85rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3)}
th:first-child{border-radius:var(--r-xs) 0 0 var(--r-xs)}th:last-child{border-radius:0 var(--r-xs) var(--r-xs) 0}
td{padding:.6rem .85rem;border-bottom:1px solid var(--border);color:var(--text-2)}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem}
.related-link{display:block;padding:1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);font-size:.85rem;font-weight:500;transition:all .2s}
.related-link:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-1px)}
.footer{background:var(--white);border-top:1px solid var(--border);margin-top:3rem;padding:2.5rem 2rem 1.5rem}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;font-size:.8rem;color:var(--text-3)}
.footer-col h4{color:var(--text);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.75rem}
.footer-col a{display:block;color:var(--text-3);margin-bottom:.5rem;transition:color .15s}.footer-col a:hover{color:var(--accent)}
.footer-bottom{text-align:center;padding-top:1.5rem;margin-top:1.5rem;border-top:1px solid var(--border);font-size:.75rem;color:var(--text-3)}
@media(max-width:768px){.form-row{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr}.risk-grid{grid-template-columns:1fr}.footer-inner{grid-template-columns:repeat(2,1fr)}.page-title{font-size:1.75rem}.related-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a href="/" class="logo">Calc<span>Leap</span></a><div class="nav-links"><a href="/">Home</a><a href="/home-insurance/">Home Insurance</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></div></div></nav>
<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span><a href="/home-insurance/">Home Insurance</a><span class="sep">›</span>${s.name}</div>
<h1 class="page-title">${s.name} Home Insurance Calculator</h1>
<p class="page-desc">Estimate your homeowners insurance premium in ${s.name}. The average annual premium is $${s.avg.toLocaleString()}, with a median home value of $${s.median.toLocaleString()}.</p>

<div class="card">
<h2>Calculate Your ${s.name} Premium</h2>
<div class="form-row">
<div class="form-group"><label>Home Value ($)</label><input type="number" id="homeValue" value="${s.median}" min="50000" step="10000"></div>
<div class="form-group"><label>Year Built</label><input type="number" id="yearBuilt" value="1995" min="1900" max="2026"></div>
</div>
<div class="form-row">
<div class="form-group"><label>Coverage Amount ($)</label><input type="number" id="coverage" value="${Math.round(s.median*0.8)}" min="50000" step="10000"></div>
<div class="form-group"><label>Deductible ($)</label><select id="deductible"><option value="500">$500</option><option value="1000"${s.deductible===1000?' selected':''}>$1,000</option><option value="1500"${s.deductible===1500?' selected':''}>$1,500</option><option value="2000"${s.deductible>=2000?' selected':''}>$2,000</option><option value="2500">$2,500</option><option value="5000">$5,000</option></select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Construction Type</label><select id="construction"><option value="frame">Wood Frame</option><option value="masonry">Masonry/Brick</option><option value="steel">Steel Frame</option><option value="superior">Superior (Fire-Resistant)</option></select></div>
<div class="form-group"><label>Roof Type</label><select id="roofType"><option value="asphalt">Asphalt Shingle</option><option value="metal">Metal</option><option value="tile">Tile/Clay</option><option value="slate">Slate</option></select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Liability Coverage</label><select id="liability"><option value="100000">$100,000</option><option value="300000" selected>$300,000</option><option value="500000">$500,000</option><option value="1000000">$1,000,000</option></select></div>
<div class="form-group"><label>Claims in Past 5 Years</label><select id="claims"><option value="0" selected>None</option><option value="1">1 Claim</option><option value="2">2 Claims</option><option value="3">3+ Claims</option></select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Security System</label><select id="security"><option value="none">None</option><option value="basic">Basic Alarm</option><option value="monitored">Monitored System</option><option value="smart">Smart Home Security</option></select></div>
<div class="form-group"><label>Credit Score Range</label><select id="credit"><option value="excellent">Excellent (750+)</option><option value="good" selected>Good (700-749)</option><option value="fair">Fair (650-699)</option><option value="poor">Poor (Below 650)</option></select></div>
</div>
<button class="btn" onclick="calculate()">Calculate Premium</button>

<div class="results" id="results">
<div class="result-grid">
<div class="result-box primary"><div class="result-label">Annual Premium</div><div class="result-val" id="annualPremium">—</div><div class="result-sub" id="monthlyPremium">per month</div></div>
<div class="result-box"><div class="result-label">Dwelling Coverage</div><div class="result-val" id="dwellingCov">—</div><div class="result-sub">replacement cost</div></div>
<div class="result-box"><div class="result-label">Personal Property</div><div class="result-val" id="personalProp">—</div><div class="result-sub">50% of dwelling</div></div>
</div>
<div class="result-grid">
<div class="result-box"><div class="result-label">Liability</div><div class="result-val" id="liabilityAmt">—</div><div class="result-sub">per occurrence</div></div>
<div class="result-box"><div class="result-label">Loss of Use</div><div class="result-val" id="lossOfUse">—</div><div class="result-sub">additional living expenses</div></div>
<div class="result-box"><div class="result-label">Deductible</div><div class="result-val" id="deductibleAmt">—</div><div class="result-sub">per claim</div></div>
</div>
<div class="chart-wrap" id="chartWrap"></div>
</div>
</div>



<div class="info-card">
<h3>🌪️ ${s.name} Risk Profile</h3>
<div class="risk-grid">
<div class="risk-item"><div class="risk-icon">💨</div><div class="risk-type">Wind/Storm</div><div class="risk-level ${riskClass(s.wind)}">${s.wind}</div></div>
<div class="risk-item"><div class="risk-icon">🌊</div><div class="risk-type">Flood</div><div class="risk-level ${riskClass(s.flood)}">${s.flood}</div></div>
<div class="risk-item"><div class="risk-icon">🧊</div><div class="risk-type">Hail</div><div class="risk-level ${riskClass(s.hail)}">${s.hail}</div></div>
<div class="risk-item"><div class="risk-icon">🔥</div><div class="risk-type">Wildfire</div><div class="risk-level ${riskClass(s.fire)}">${s.fire}</div></div>
</div>
<p style="margin-top:1rem"><strong>Key factors:</strong> ${s.factors}</p>
</div>

<div class="info-card">
<h3>📊 ${s.name} Home Insurance at a Glance</h3>
<table>
<tr><th>Metric</th><th>Value</th></tr>
<tr><td>Average Annual Premium</td><td><strong>$${s.avg.toLocaleString()}</strong></td></tr>
<tr><td>National Average</td><td>$2,230</td></tr>
<tr><td>${s.avg > 2230 ? 'Above' : 'Below'} National Average By</td><td>${s.avg > 2230 ? '+' : ''}$${Math.abs(s.avg - 2230).toLocaleString()} (${((s.avg/2230-1)*100).toFixed(1)}%)</td></tr>
<tr><td>Median Home Value</td><td>$${s.median.toLocaleString()}</td></tr>
<tr><td>Avg Rate per $1,000</td><td>$${(s.rate*1000).toFixed(2)}</td></tr>
<tr><td>Typical Deductible</td><td>$${s.deductible.toLocaleString()}</td></tr>
</table>
</div>



<div class="info-card">
<h3>🏠 What Does Home Insurance Cover in ${s.name}?</h3>
<p>A standard homeowners insurance policy (HO-3) in ${s.name} typically includes these six coverages:</p>
<ul>
<li><strong>Dwelling (Coverage A)</strong> — Covers the structure of your home against covered perils like fire, wind, and hail. In ${s.name}, this is especially important due to ${s.factors.toLowerCase()}.</li>
<li><strong>Other Structures (Coverage B)</strong> — Covers detached structures like garages, fences, and sheds. Typically 10% of your dwelling coverage.</li>
<li><strong>Personal Property (Coverage C)</strong> — Covers your belongings (furniture, electronics, clothing). Usually 50-70% of dwelling coverage. Consider a home inventory for ${s.name} residents.</li>
<li><strong>Loss of Use (Coverage D)</strong> — Pays additional living expenses if your home becomes uninhabitable. Critical in ${s.name} where ${s.wind.includes('High') || s.wind.includes('Very') ? 'wind/storm damage can displace families' : s.fire.includes('High') || s.fire.includes('Very') ? 'wildfire evacuations may be necessary' : 'weather events can damage homes'}.</li>
<li><strong>Liability (Coverage E)</strong> — Protects you if someone is injured on your property. Recommended minimum: $300,000 in ${s.name}.</li>
<li><strong>Medical Payments (Coverage F)</strong> — Covers medical expenses for guests injured on your property, regardless of fault. Typically $1,000-$5,000.</li>
</ul>
${s.flood.includes('High') || s.flood.includes('Very') ? '<p style="margin-top:1rem"><strong>⚠️ Important:</strong> Standard home insurance in '+s.name+' does NOT cover flood damage. With '+s.flood.toLowerCase()+' flood risk, you should strongly consider a separate NFIP or private flood insurance policy.</p>' : ''}
${s.abbr === 'CA' ? '<p style="margin-top:1rem"><strong>⚠️ California Note:</strong> Standard policies do NOT cover earthquake damage. Consider a separate earthquake policy from the California Earthquake Authority (CEA).</p>' : ''}
</div>

<div class="info-card">
<h3>💰 How to Save on Home Insurance in ${s.name}</h3>
<ul>
<li><strong>Bundle policies</strong> — Combine home and auto insurance for 10-25% savings with most ${s.name} carriers.</li>
<li><strong>Increase your deductible</strong> — Raising from $1,000 to $2,500 can save 15-25% on premiums in ${s.name}.</li>
<li><strong>Install security systems</strong> — Monitored alarms can save 5-15%. Smart home devices (leak detectors, smoke alarms) may qualify for additional discounts.</li>
<li><strong>Improve your credit</strong> — In ${s.name}, ${s.abbr === 'CA' || s.abbr === 'MD' || s.abbr === 'MA' ? 'credit score is NOT used for insurance rating by law' : 'credit-based insurance scores significantly impact your premium. Improving from "Fair" to "Excellent" can save 20-40%'}.</li>
<li><strong>Roof upgrades</strong> — ${s.hail.includes('High') || s.hail.includes('Very') ? 'Impact-resistant roofing (Class 4) can save 10-35% in '+s.name+' due to high hail risk' : s.wind.includes('High') || s.wind.includes('Very') ? 'Wind-resistant roofing and hurricane straps can save 10-30% in '+s.name : 'A newer roof (less than 10 years old) can save 5-20% on premiums'}.</li>
<li><strong>Claims-free discount</strong> — Many ${s.name} insurers offer 5-15% discounts for 3-5 years without claims.</li>
<li><strong>Shop around</strong> — Get quotes from at least 3-5 carriers. ${s.name} rates vary significantly between companies — the cheapest can be 40-60% less than the most expensive for the same coverage.</li>
</ul>
</div>

<div class="info-card">
<h3>❓ Frequently Asked Questions — ${s.name} Home Insurance</h3>
<ul>
<li><strong>What is the average home insurance cost in ${s.name}?</strong><br>The average annual homeowners insurance premium in ${s.name} is $${s.avg.toLocaleString()}, which is ${s.avg > 2230 ? 'above' : 'below'} the national average of $2,230. Your actual premium depends on home value, location, coverage level, deductible, and claims history.</li>
<li><strong>What are the biggest risks for homeowners in ${s.name}?</strong><br>${s.factors}. These factors significantly influence insurance rates across the state.</li>
<li><strong>Is flood insurance required in ${s.name}?</strong><br>${s.flood.includes('High') || s.flood.includes('Very') ? 'If your '+s.name+' home is in a FEMA-designated flood zone and you have a federally-backed mortgage, flood insurance IS required. Even outside designated zones, it\'s strongly recommended given '+s.name+'\'s flood risk.' : 'Flood insurance is required if your '+s.name+' home is in a FEMA-designated high-risk flood zone and you have a federally-backed mortgage. It\'s optional but recommended for all homeowners since 25% of flood claims come from outside high-risk zones.'}</li>
<li><strong>How much liability coverage do I need in ${s.name}?</strong><br>Most experts recommend at least $300,000-$500,000 in liability coverage. If you have significant assets, consider a $1M umbrella policy. ${s.name}'s median home value of $${s.median.toLocaleString()} suggests adequate liability protection is essential.</li>
<li><strong>What discounts are available in ${s.name}?</strong><br>Common discounts include: bundling (10-25%), security systems (5-15%), ${s.hail.includes('High') || s.hail.includes('Very') ? 'impact-resistant roofing (10-35%), ' : ''}claims-free (5-15%), new home (5-15%), and loyalty discounts (5-10%). Ask your insurer about all available discounts.</li>
<li><strong>Should I choose actual cash value or replacement cost?</strong><br>Replacement cost coverage is strongly recommended for ${s.name} homeowners. It pays to rebuild your home at current construction costs without deducting depreciation. Actual cash value is cheaper but may leave you significantly underinsured.</li>
</ul>
</div>



<div class="info-card">
<h3>🔗 Related Calculators</h3>
<div class="related-grid">
<a href="/workers-comp/${slug(s.name)}-workers-comp-calculator.html" class="related-link">🏗️ ${s.name} Workers' Comp</a>
<a href="/disability-insurance/${slug(s.name)}-disability-insurance-calculator.html" class="related-link">♿ ${s.name} Disability Insurance</a>
<a href="/social-security/${slug(s.name)}-social-security-calculator.html" class="related-link">🏛️ ${s.name} Social Security</a>
<a href="/529/${slug(s.name)}-529-plan-calculator.html" class="related-link">🎓 ${s.name} 529 Plan</a>
<a href="/childcare/${slug(s.name)}-childcare-cost-calculator.html" class="related-link">👶 ${s.name} Childcare Costs</a>
<a href="/home-insurance/" class="related-link">🏠 All State Home Insurance</a>
</div>
</div>

</div>

<footer class="footer"><div class="footer-inner">
<div class="footer-col"><h4>CalcLeap</h4><a href="/">Home</a><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy Policy</a></div>
<div class="footer-col"><h4>Insurance</h4><a href="/home-insurance/">Home Insurance</a><a href="/workers-comp/">Workers' Comp</a><a href="/disability-insurance/">Disability Insurance</a></div>
<div class="footer-col"><h4>Finance</h4><a href="/social-security/">Social Security</a><a href="/529/">529 Plans</a><a href="/childcare/">Childcare Costs</a></div>
<div class="footer-col"><h4>Legal</h4><p>For informational purposes only. Not a substitute for professional insurance advice. Consult a licensed insurance agent for accurate quotes.</p></div>
</div><div class="footer-bottom">© 2026 CalcLeap — Free financial calculators for everyone.</div></footer>

<script>
const STATE_RATE=${s.rate};
const STATE_AVG=${s.avg};
function fmt(n){return'$'+n.toLocaleString('en-US',{maximumFractionDigits:0})}
function calculate(){
  const hv=+document.getElementById('homeValue').value;
  const yb=+document.getElementById('yearBuilt').value;
  const cov=+document.getElementById('coverage').value;
  const ded=+document.getElementById('deductible').value;
  const cons=document.getElementById('construction').value;
  const roof=document.getElementById('roofType').value;
  const liab=+document.getElementById('liability').value;
  const claims=+document.getElementById('claims').value;
  const sec=document.getElementById('security').value;
  const cred=document.getElementById('credit').value;
  let base=cov*STATE_RATE;
  const age=2026-yb;
  if(age>50)base*=1.25;else if(age>30)base*=1.15;else if(age>15)base*=1.05;else base*=0.95;
  const consMult={frame:1.0,masonry:0.9,steel:0.85,superior:0.8};base*=(consMult[cons]||1);
  const roofMult={asphalt:1.0,metal:0.9,tile:0.92,slate:0.88};base*=(roofMult[roof]||1);
  if(liab>=500000)base+=120;else if(liab>=300000)base+=60;
  base+=claims*350;
  const secDisc={none:0,basic:0.05,monitored:0.1,smart:0.15};base*=(1-(secDisc[sec]||0));
  const credMult={excellent:0.85,good:1.0,fair:1.15,poor:1.35};base*=(credMult[cred]||1);
  if(ded>=5000)base*=0.78;else if(ded>=2500)base*=0.85;else if(ded>=2000)base*=0.88;else if(ded>=1500)base*=0.92;else if(ded>=1000)base*=0.95;
  base=Math.max(base,400);
  const annual=Math.round(base);
  const monthly=Math.round(base/12);
  const pp=Math.round(cov*0.5);
  const lou=Math.round(cov*0.2);
  document.getElementById('annualPremium').textContent=fmt(annual);
  document.getElementById('monthlyPremium').textContent=fmt(monthly)+'/mo';
  document.getElementById('dwellingCov').textContent=fmt(cov);
  document.getElementById('personalProp').textContent=fmt(pp);
  document.getElementById('liabilityAmt').textContent=fmt(liab);
  document.getElementById('lossOfUse').textContent=fmt(lou);
  document.getElementById('deductibleAmt').textContent=fmt(ded);
  document.getElementById('results').style.display='block';
  const items=[{label:'Dwelling',val:Math.round(annual*0.55),color:'#0071e3'},{label:'Personal Prop',val:Math.round(annual*0.18),color:'#34c759'},{label:'Liability',val:Math.round(annual*0.12),color:'#ff9500'},{label:'Loss of Use',val:Math.round(annual*0.08),color:'#af52de'},{label:'Other',val:Math.round(annual*0.07),color:'#5ac8fa'}];
  const maxV=Math.max(...items.map(i=>i.val));
  let html='<h3 style="font-size:.95rem;margin-bottom:1rem">Premium Breakdown</h3>';
  items.forEach(i=>{const pct=Math.round(i.val/maxV*100);html+=\`<div class="bar-row"><div class="bar-label">\${i.label}</div><div class="bar-track"><div class="bar-fill" style="width:\${pct}%;background:\${i.color}">\${Math.round(i.val/annual*100)}%</div></div><div class="bar-amount">\${fmt(i.val)}</div></div>\`});
  document.getElementById('chartWrap').innerHTML=html;
}
document.addEventListener('DOMContentLoaded',calculate);
document.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',calculate));
document.querySelectorAll('input[type=number]').forEach(el=>el.addEventListener('input',calculate));
</script>
</body>
</html>`;
}

function riskClass(level) {
  if (level.includes('Very High')) return 'risk-very-high';
  if (level.includes('High')) return 'risk-high';
  if (level.includes('Moderate')) return 'risk-moderate';
  return 'risk-low';
}

// Generate all state pages
states.forEach(s => {
  const fname = `${slug(s.name)}-home-insurance-calculator.html`;
  fs.writeFileSync(path.join('home-insurance', fname), genStatePage(s));
});
console.log(`Generated ${states.length} state pages`);

// Generate index page
const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Home Insurance Calculator by State — Compare Rates Across All 50 States | CalcLeap</title>
<meta name="description" content="Compare home insurance rates across all 50 US states. Find average premiums, risk factors, and estimate your homeowners insurance cost by state.">
<link rel="canonical" href="https://calcleap.com/home-insurance/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#f5f5f7;--surface:#fff;--border:rgba(0,0,0,.08);--text:#1d1d1f;--text-2:#424245;--text-3:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--shadow:0 2px 12px rgba(0,0,0,.06);--r:16px;--r-sm:12px;--r-xs:8px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif}
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
.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--accent)}.breadcrumb .sep{margin:0 .35rem;opacity:.4}
.page-title{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}
.page-desc{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:700px}
.search-box{width:100%;padding:.75rem 1rem;font-size:1rem;font-family:var(--font);border:1px solid var(--border);border-radius:var(--r-sm);background:var(--white);margin-bottom:1.5rem;outline:none}
.search-box:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1)}
.highlights{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
.highlight{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.25rem;text-align:center;box-shadow:var(--shadow)}
.highlight .label{font-size:.72rem;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.04em}
.highlight .val{font-size:1.4rem;font-weight:800;margin:.25rem 0}
.highlight .sub{font-size:.8rem;color:var(--text-3)}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:0;box-shadow:var(--shadow);margin-bottom:1.5rem;overflow:hidden}
table{width:100%;border-collapse:collapse;font-size:.875rem}
th{background:var(--bg);font-weight:600;text-align:left;padding:.7rem .85rem;font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3);cursor:pointer;user-select:none;position:sticky;top:0}
th:hover{color:var(--accent)}
td{padding:.6rem .85rem;border-bottom:1px solid var(--border);color:var(--text-2)}
tr:hover td{background:rgba(0,113,227,.02)}
td a{color:var(--accent);font-weight:500}td a:hover{text-decoration:underline}
.risk-badge{display:inline-block;padding:.15rem .5rem;border-radius:4px;font-size:.7rem;font-weight:600}
.risk-low{background:rgba(52,199,89,.1);color:#1b8a3e}
.risk-moderate{background:rgba(255,149,0,.1);color:#c27400}
.risk-high{background:rgba(255,59,48,.1);color:#d32f2f}
.risk-very-high{background:rgba(175,29,51,.15);color:#af1d33}
.ad-slot{margin:1.5rem 0}
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;margin-bottom:1.25rem;box-shadow:var(--shadow)}
.info-card h3{font-size:1rem;font-weight:700;margin-bottom:1rem}
.info-card p,.info-card li{font-size:.9rem;color:var(--text-2);line-height:1.6;margin-bottom:.5rem}
.info-card ul{padding-left:1.25rem}
.footer{background:var(--white);border-top:1px solid var(--border);margin-top:3rem;padding:2.5rem 2rem 1.5rem}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;font-size:.8rem;color:var(--text-3)}
.footer-col h4{color:var(--text);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.75rem}
.footer-col a{display:block;color:var(--text-3);margin-bottom:.5rem;transition:color .15s}.footer-col a:hover{color:var(--accent)}
.footer-bottom{text-align:center;padding-top:1.5rem;margin-top:1.5rem;border-top:1px solid var(--border);font-size:.75rem;color:var(--text-3)}
@media(max-width:768px){.highlights{grid-template-columns:1fr}.footer-inner{grid-template-columns:repeat(2,1fr)}.page-title{font-size:1.75rem}table{font-size:.8rem}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a href="/" class="logo">Calc<span>Leap</span></a><div class="nav-links"><a href="/">Home</a><a href="/home-insurance/">Home Insurance</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></div></div></nav>
<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span>Home Insurance by State</div>
<h1 class="page-title">Home Insurance Calculator by State</h1>
<p class="page-desc">Compare homeowners insurance rates across all 50 US states. Find average premiums, risk factors, and calculate your estimated cost based on your home's specifics.</p>

<div class="highlights">
<div class="highlight"><div class="label">Most Expensive</div><div class="val" style="color:#ff3b30">Florida — $4,231</div><div class="sub">Hurricane & flood risk</div></div>
<div class="highlight"><div class="label">National Average</div><div class="val" style="color:#0071e3">$2,230/year</div><div class="sub">Varies widely by state</div></div>
<div class="highlight"><div class="label">Least Expensive</div><div class="val" style="color:#34c759">Vermont — $1,110</div><div class="sub">Low natural disaster risk</div></div>
</div>

<input type="text" class="search-box" id="search" placeholder="Search by state name..." oninput="filterTable()">

<div class="card">
<table id="stateTable">
<thead><tr>
<th onclick="sortTable(0)">State</th>
<th onclick="sortTable(1)">Avg Premium</th>
<th onclick="sortTable(2)">Median Home</th>
<th onclick="sortTable(3)">Rate/$1K</th>
<th onclick="sortTable(4)">Top Risk</th>
</tr></thead>
<tbody>
${states.sort((a,b)=>a.name.localeCompare(b.name)).map(s => {
  const topRisk = [
    {type:'Wind',level:s.wind},{type:'Flood',level:s.flood},
    {type:'Hail',level:s.hail},{type:'Fire',level:s.fire}
  ].sort((a,b)=>{
    const order={'Very High':4,'High':3,'Moderate':2,'Low':1};
    return (order[b.level.replace(/ \(.*/,'')]||0)-(order[a.level.replace(/ \(.*/,'')]||0);
  })[0];
  const rc = topRisk.level.includes('Very') ? 'risk-very-high' : topRisk.level.includes('High') ? 'risk-high' : topRisk.level.includes('Moderate') ? 'risk-moderate' : 'risk-low';
  return `<tr><td><a href="${slug(s.name)}-home-insurance-calculator.html">${s.name}</a></td><td>$${s.avg.toLocaleString()}</td><td>$${s.median.toLocaleString()}</td><td>$${(s.rate*1000).toFixed(2)}</td><td><span class="risk-badge ${rc}">${topRisk.type}: ${topRisk.level}</span></td></tr>`;
}).join('\n')}
</tbody>
</table>
</div>



<div class="info-card">
<h3>📖 Understanding Home Insurance Costs</h3>
<p>Homeowners insurance premiums vary dramatically across the United States. Factors that influence your rate include:</p>
<ul>
<li><strong>Location & Natural Disaster Risk</strong> — States prone to hurricanes (FL, LA, TX), tornadoes (OK, KS, NE), hail (CO, MN, SD), or wildfire (CA, MT, OR) have higher premiums.</li>
<li><strong>Home Value & Construction</strong> — More expensive homes cost more to insure. Masonry and fire-resistant construction can lower premiums by 10-20%.</li>
<li><strong>Age of Home</strong> — Older homes (30+ years) cost more to insure due to aging electrical, plumbing, and roofing systems.</li>
<li><strong>Deductible Choice</strong> — Higher deductibles lower premiums. Raising from $1,000 to $2,500 typically saves 15-25%.</li>
<li><strong>Credit Score</strong> — In most states, credit-based insurance scores are a major rating factor. Better credit = lower premiums.</li>
<li><strong>Claims History</strong> — Prior claims can increase premiums 20-40% per claim for 3-5 years.</li>
</ul>
</div>

<div class="info-card">
<h3>🏠 Most vs. Least Expensive States</h3>
<p><strong>Most expensive:</strong> Florida ($4,231), Louisiana ($3,600), Oklahoma ($3,400), Texas ($3,340), Kansas ($2,960) — all states with significant hurricane, tornado, or hail risk.</p>
<p><strong>Least expensive:</strong> Vermont ($1,110), Washington ($1,130), Oregon ($1,180), Maine ($1,180), New Hampshire ($1,180), Utah ($1,180) — states with lower natural disaster frequency.</p>
<p>The difference between the most and least expensive states is over $3,000/year — making location one of the biggest factors in your premium.</p>
</div>

</div>
<footer class="footer"><div class="footer-inner">
<div class="footer-col"><h4>CalcLeap</h4><a href="/">Home</a><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy Policy</a></div>
<div class="footer-col"><h4>Insurance</h4><a href="/home-insurance/">Home Insurance</a><a href="/workers-comp/">Workers' Comp</a><a href="/disability-insurance/">Disability Insurance</a></div>
<div class="footer-col"><h4>Finance</h4><a href="/social-security/">Social Security</a><a href="/529/">529 Plans</a><a href="/childcare/">Childcare Costs</a></div>
<div class="footer-col"><h4>Legal</h4><p>For informational purposes only. Not a substitute for professional insurance advice.</p></div>
</div><div class="footer-bottom">© 2026 CalcLeap — Free financial calculators for everyone.</div></footer>
<script>
function filterTable(){const q=document.getElementById('search').value.toLowerCase();document.querySelectorAll('#stateTable tbody tr').forEach(r=>{r.style.display=r.cells[0].textContent.toLowerCase().includes(q)?'':'none'})}
function sortTable(n){const tb=document.querySelector('#stateTable tbody');const rows=[...tb.rows];const dir=tb.dataset.sort==n?-1:1;tb.dataset.sort=dir==1?n:'';rows.sort((a,b)=>{let va=a.cells[n].textContent.replace(/[\\$,]/g,''),vb=b.cells[n].textContent.replace(/[\\$,]/g,'');return isNaN(va)?va.localeCompare(vb)*dir:(va-vb)*dir});rows.forEach(r=>tb.appendChild(r))}
</script>
</body>
</html>`;

fs.writeFileSync(path.join('home-insurance', 'index.html'), indexHTML);
console.log('Generated index page');
console.log(`Total: ${states.length + 1} pages`);
