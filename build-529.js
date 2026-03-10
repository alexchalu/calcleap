const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '529');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const states = [
  { abbr: 'AL', name: 'Alabama', plan: 'CollegeCounts 529', deduction: 'Full', maxDeduction: 'Unlimited (up to $5,000 single / $10,000 married)', taxRate: 5.0, maxContrib: 450000, mgr: 'Union Bank & Trust', rating: 4, costOfCollege: 24500 },
  { abbr: 'AK', name: 'Alaska', plan: 'T. Rowe Price College Savings Plan', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 475000, mgr: 'T. Rowe Price', rating: 5, costOfCollege: 19800 },
  { abbr: 'AZ', name: 'Arizona', plan: 'Arizona Family College Savings Plan', deduction: 'Full', maxDeduction: '$2,000 single / $4,000 married', taxRate: 2.5, maxContrib: 531000, mgr: 'Fidelity', rating: 5, costOfCollege: 27200 },
  { abbr: 'AR', name: 'Arkansas', plan: 'GIFT College Investing Plan', deduction: 'Full', maxDeduction: '$5,000 single / $10,000 married', taxRate: 4.4, maxContrib: 366000, mgr: 'Vanguard', rating: 4, costOfCollege: 22800 },
  { abbr: 'CA', name: 'California', plan: 'ScholarShare 529', deduction: 'None', maxDeduction: 'N/A', taxRate: 0, maxContrib: 529000, mgr: 'TIAA-CREF', rating: 5, costOfCollege: 36200 },
  { abbr: 'CO', name: 'Colorado', plan: 'CollegeInvest Direct Portfolio', deduction: 'Full', maxDeduction: 'Unlimited', taxRate: 4.4, maxContrib: 500000, mgr: 'FirstBank', rating: 5, costOfCollege: 28400 },
  { abbr: 'CT', name: 'Connecticut', plan: 'CHET 529 College Savings Plan', deduction: 'Full', maxDeduction: '$5,000 single / $10,000 married', taxRate: 3.0, maxContrib: 550000, mgr: 'Fidelity', rating: 4, costOfCollege: 39500 },
  { abbr: 'DE', name: 'Delaware', plan: 'Delaware 529 Education Savings Plan', deduction: 'None', maxDeduction: 'N/A', taxRate: 0, maxContrib: 350000, mgr: 'Fidelity', rating: 3, costOfCollege: 30200 },
  { abbr: 'FL', name: 'Florida', plan: 'Florida 529 Savings Plan', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 418000, mgr: 'Florida Prepaid', rating: 5, costOfCollege: 28900 },
  { abbr: 'GA', name: 'Georgia', plan: 'Path2College 529 Plan', deduction: 'Full', maxDeduction: '$4,000 single / $8,000 married', taxRate: 5.49, maxContrib: 235000, mgr: 'TIAA-CREF', rating: 4, costOfCollege: 26300 },
  { abbr: 'HI', name: 'Hawaii', plan: 'HI529 Hawaii College Savings', deduction: 'None', maxDeduction: 'N/A', taxRate: 0, maxContrib: 305000, mgr: 'Ascensus', rating: 3, costOfCollege: 28700 },
  { abbr: 'ID', name: 'Idaho', plan: 'IDeal Idaho 529 Plan', deduction: 'Full', maxDeduction: '$6,000 single / $12,000 married', taxRate: 5.8, maxContrib: 500000, mgr: 'Ascensus', rating: 4, costOfCollege: 25100 },
  { abbr: 'IL', name: 'Illinois', plan: 'Bright Start 529', deduction: 'Full', maxDeduction: '$10,000 single / $20,000 married', taxRate: 4.95, maxContrib: 450000, mgr: 'Union Bank & Trust', rating: 5, costOfCollege: 33400 },
  { abbr: 'IN', name: 'Indiana', plan: 'CollegeChoice 529 Direct', deduction: '20% tax credit', maxDeduction: '$7,500 credit on $5,000 contribution', taxRate: 3.05, maxContrib: 450000, mgr: 'Ascensus', rating: 5, costOfCollege: 24800 },
  { abbr: 'IA', name: 'Iowa', plan: 'College Savings Iowa', deduction: 'Full', maxDeduction: '$3,785 single / $7,570 married (2026)', taxRate: 5.7, maxContrib: 420000, mgr: 'Vanguard', rating: 5, costOfCollege: 24200 },
  { abbr: 'KS', name: 'Kansas', plan: 'Learning Quest 529', deduction: 'Full', maxDeduction: '$3,000 single / $6,000 married', taxRate: 5.7, maxContrib: 450000, mgr: 'American Century', rating: 4, costOfCollege: 24600 },
  { abbr: 'KY', name: 'Kentucky', plan: 'KY Saves 529', deduction: 'None', maxDeduction: 'N/A', taxRate: 0, maxContrib: 450000, mgr: 'Ascensus', rating: 3, costOfCollege: 25500 },
  { abbr: 'LA', name: 'Louisiana', plan: 'START Saving Program', deduction: 'Full', maxDeduction: '$2,400 single / $4,800 married', taxRate: 4.25, maxContrib: 500000, mgr: 'Louisiana OFI', rating: 4, costOfCollege: 25800 },
  { abbr: 'ME', name: 'Maine', plan: 'NextGen 529', deduction: 'None', maxDeduction: 'N/A', taxRate: 0, maxContrib: 520000, mgr: 'Merrill Lynch', rating: 4, costOfCollege: 30500 },
  { abbr: 'MD', name: 'Maryland', plan: 'Maryland 529', deduction: 'Full', maxDeduction: '$2,500 per account per year', taxRate: 4.75, maxContrib: 500000, mgr: 'T. Rowe Price', rating: 5, costOfCollege: 31200 },
  { abbr: 'MA', name: 'Massachusetts', plan: 'U.Fund College Investing Plan', deduction: 'None', maxDeduction: 'N/A', taxRate: 0, maxContrib: 500000, mgr: 'Fidelity', rating: 5, costOfCollege: 42100 },
  { abbr: 'MI', name: 'Michigan', plan: 'Michigan Education Savings Program', deduction: 'Full', maxDeduction: '$5,000 single / $10,000 married', taxRate: 4.25, maxContrib: 500000, mgr: 'TIAA-CREF', rating: 5, costOfCollege: 28600 },
  { abbr: 'MN', name: 'Minnesota', plan: 'Minnesota 529 College Savings Plan', deduction: 'Full', maxDeduction: '$1,500 single / $3,000 married (credit + deduction)', taxRate: 5.35, maxContrib: 425000, mgr: 'TIAA-CREF', rating: 4, costOfCollege: 29800 },
  { abbr: 'MS', name: 'Mississippi', plan: 'Mississippi Affordable College Savings', deduction: 'Full', maxDeduction: '$10,000 single / $20,000 married', taxRate: 5.0, maxContrib: 235000, mgr: 'TIAA-CREF', rating: 4, costOfCollege: 22500 },
  { abbr: 'MO', name: 'Missouri', plan: 'MOST 529 Education Plan', deduction: 'Full', maxDeduction: '$8,000 single / $16,000 married', taxRate: 4.8, maxContrib: 550000, mgr: 'Ascensus', rating: 4, costOfCollege: 25200 },
  { abbr: 'MT', name: 'Montana', plan: 'Achieve Montana', deduction: 'Full', maxDeduction: '$3,000 single / $6,000 married', taxRate: 6.75, maxContrib: 396000, mgr: 'Ascensus', rating: 4, costOfCollege: 23800 },
  { abbr: 'NE', name: 'Nebraska', plan: 'NEST 529 College Savings Plan', deduction: 'Full', maxDeduction: '$5,000 single / $10,000 married', taxRate: 5.84, maxContrib: 500000, mgr: 'First National Bank', rating: 5, costOfCollege: 24400 },
  { abbr: 'NV', name: 'Nevada', plan: 'SSGA Upromise 529 Plan', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 500000, mgr: 'Ascensus/SSGA', rating: 5, costOfCollege: 25600 },
  { abbr: 'NH', name: 'New Hampshire', plan: 'UNIQUE College Investing Plan', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 569135, mgr: 'Fidelity', rating: 5, costOfCollege: 34200 },
  { abbr: 'NJ', name: 'New Jersey', plan: 'NJBEST 529 College Savings Plan', deduction: 'Full', maxDeduction: '$10,000 (income under $200K)', taxRate: 5.525, maxContrib: 305000, mgr: 'Franklin Templeton', rating: 4, costOfCollege: 35800 },
  { abbr: 'NM', name: 'New Mexico', plan: 'The Education Plan', deduction: 'Full', maxDeduction: 'Unlimited', taxRate: 4.9, maxContrib: 500000, mgr: 'OppenheimerFunds', rating: 4, costOfCollege: 24100 },
  { abbr: 'NY', name: 'New York', plan: 'NY 529 Direct Plan', deduction: 'Full', maxDeduction: '$5,000 single / $10,000 married', taxRate: 6.0, maxContrib: 520000, mgr: 'Vanguard', rating: 5, costOfCollege: 38500 },
  { abbr: 'NC', name: 'North Carolina', plan: 'NC 529 Plan', deduction: 'None', maxDeduction: 'N/A', taxRate: 0, maxContrib: 450000, mgr: 'The Vanguard Group', rating: 4, costOfCollege: 26800 },
  { abbr: 'ND', name: 'North Dakota', plan: 'College SAVE', deduction: 'Full', maxDeduction: '$5,000 single / $10,000 married', taxRate: 1.95, maxContrib: 269000, mgr: 'Ascensus', rating: 3, costOfCollege: 22100 },
  { abbr: 'OH', name: 'Ohio', plan: 'Ohio 529 Plan (CollegeAdvantage)', deduction: 'Full', maxDeduction: '$4,000 per beneficiary', taxRate: 3.5, maxContrib: 517000, mgr: 'Ohio Tuition Trust', rating: 5, costOfCollege: 27400 },
  { abbr: 'OK', name: 'Oklahoma', plan: 'Oklahoma 529 College Savings Plan', deduction: 'Full', maxDeduction: '$10,000 single / $20,000 married', taxRate: 4.75, maxContrib: 450000, mgr: 'TIAA-CREF', rating: 4, costOfCollege: 23500 },
  { abbr: 'OR', name: 'Oregon', plan: 'Oregon College Savings Plan', deduction: 'Full', maxDeduction: '$150 credit ($300 married) or deduction', taxRate: 8.75, maxContrib: 400000, mgr: 'TIAA-CREF', rating: 5, costOfCollege: 29600 },
  { abbr: 'PA', name: 'Pennsylvania', plan: 'PA 529 Investment Plan', deduction: 'Full', maxDeduction: '$17,000 single / $34,000 married', taxRate: 3.07, maxContrib: 511758, mgr: 'Vanguard', rating: 5, costOfCollege: 33100 },
  { abbr: 'RI', name: 'Rhode Island', plan: 'CollegeBound 529', deduction: 'Full', maxDeduction: '$500 single / $1,000 married', taxRate: 3.75, maxContrib: 520000, mgr: 'Invesco', rating: 3, costOfCollege: 32400 },
  { abbr: 'SC', name: 'South Carolina', plan: 'Future Scholar 529', deduction: 'Full', maxDeduction: 'Unlimited', taxRate: 6.4, maxContrib: 540000, mgr: 'Columbia Threadneedle', rating: 4, costOfCollege: 26100 },
  { abbr: 'SD', name: 'South Dakota', plan: 'CollegeAccess 529', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 350000, mgr: 'Allianz Global', rating: 4, costOfCollege: 23200 },
  { abbr: 'TN', name: 'Tennessee', plan: 'TNStars College Savings 529', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 350000, mgr: 'TIAA-CREF', rating: 4, costOfCollege: 25400 },
  { abbr: 'TX', name: 'Texas', plan: 'Texas College Savings Plan (Lonestar 529)', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 500000, mgr: 'Orion Advisor', rating: 4, costOfCollege: 27600 },
  { abbr: 'UT', name: 'Utah', plan: 'my529', deduction: '4.65% tax credit', maxDeduction: '$2,290 single / $4,580 married credit', taxRate: 4.65, maxContrib: 525000, mgr: 'Utah Higher Ed', rating: 5, costOfCollege: 25300 },
  { abbr: 'VT', name: 'Vermont', plan: 'Vermont Higher Education Investment Plan', deduction: '10% tax credit', maxDeduction: '$250 single / $500 married credit', taxRate: 3.35, maxContrib: 550000, mgr: 'Intuition College Savings', rating: 3, costOfCollege: 33800 },
  { abbr: 'VA', name: 'Virginia', plan: 'Virginia529 Invest529', deduction: 'Full', maxDeduction: '$4,000 per account', taxRate: 5.75, maxContrib: 550000, mgr: 'Virginia529', rating: 5, costOfCollege: 29200 },
  { abbr: 'WA', name: 'Washington', plan: 'DreamAhead College Investment Plan', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 500000, mgr: 'Lockwood Advisors', rating: 4, costOfCollege: 28300 },
  { abbr: 'WV', name: 'West Virginia', plan: 'SMART529 WV Direct', deduction: 'Full', maxDeduction: 'Unlimited', taxRate: 6.5, maxContrib: 340000, mgr: 'Hartford Funds', rating: 4, costOfCollege: 21800 },
  { abbr: 'WI', name: 'Wisconsin', plan: 'Edvest 529', deduction: 'Full', maxDeduction: '$3,860 single / $5,790 married (2026)', taxRate: 5.3, maxContrib: 527000, mgr: 'TIAA-CREF', rating: 5, costOfCollege: 26700 },
  { abbr: 'WY', name: 'Wyoming', plan: 'WY529 College Savings Plan', deduction: 'None (no state income tax)', maxDeduction: 'N/A', taxRate: 0, maxContrib: 350000, mgr: 'WealthFront', rating: 3, costOfCollege: 22900 },
  { abbr: 'DC', name: 'District of Columbia', plan: 'DC College Savings Plan', deduction: 'Full', maxDeduction: '$4,000 single / $8,000 married', taxRate: 6.5, maxContrib: 500000, mgr: 'Ascensus', rating: 4, costOfCollege: 35200 }
];

function generateStatePage(state) {
  const slug = state.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
  const hasDeduction = !state.deduction.includes('None');
  const annualContrib = hasDeduction ? Math.min(parseInt(state.maxDeduction.replace(/[^0-9]/g,'')) || 5000, 10000) : 5000;
  const fourYearCost = state.costOfCollege * 4;
  const costIn18Yrs = Math.round(fourYearCost * Math.pow(1.05, 18));
  
  return { slug, html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${state.name} 529 College Savings Plan Calculator — Free | CalcLeap</title>
<meta name="description" content="Calculate your ${state.name} 529 plan savings and tax benefits. ${state.plan} growth projections, state tax deductions, and college cost estimates for ${state.abbr} families.">
<link rel="canonical" href="https://calcleap.com/529/${slug}.html">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<meta property="og:type" content="website">
<meta property="og:url" content="https://calcleap.com/529/${slug}.html">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${state.name} 529 College Savings Calculator","description":"Calculate 529 plan savings, tax benefits, and college cost projections for ${state.name} families.","url":"https://calcleap.com/529/${slug}.html","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#fafafa;--surface:#fff;--border:rgba(0,0,0,.06);--border-hover:rgba(0,0,0,.12);--text:#1d1d1f;--text-secondary:#6e6e73;--text-tertiary:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-subtle:rgba(0,113,227,.06);--shadow-sm:0 1px 3px rgba(0,0,0,.04),0 1px 2px rgba(0,0,0,.06);--shadow-md:0 4px 16px rgba(0,0,0,.06),0 1px 4px rgba(0,0,0,.04);--radius:16px;--radius-sm:12px;--max-w:1120px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.5;letter-spacing:-.022em}
a{color:inherit;text-decoration:none}
.cl-nav{position:sticky;top:0;z-index:100;background:rgba(251,251,253,.72);backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.cl-nav-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px}
.cl-logo{font-size:1.15rem;font-weight:700;letter-spacing:-.02em}.cl-logo span{color:var(--accent)}
.cl-nav-links{display:flex;align-items:center;gap:.25rem}
.cl-nav-links a{font-size:.8125rem;font-weight:400;color:var(--text-secondary);padding:.5rem .75rem;border-radius:8px;transition:all .2s}
.cl-nav-links a:hover{color:var(--text);background:rgba(0,0,0,.03)}
main{max-width:var(--max-w);margin:0 auto;padding:1rem 2rem 3rem}
.breadcrumb{font-size:.8125rem;color:var(--text-tertiary);margin-bottom:.5rem;padding:.5rem 0}
.breadcrumb a{color:var(--text-secondary);transition:color .15s}.breadcrumb a:hover{color:var(--accent)}
.breadcrumb span{margin:0 .4rem;opacity:.5}
.hero{text-align:left;padding:1rem 0 1.5rem}
.hero h1{font-size:2rem;font-weight:700;letter-spacing:-.03em}
.hero p{font-size:1rem;color:var(--text-secondary);max-width:640px;margin-top:.5rem}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;box-shadow:var(--shadow-sm);margin-bottom:1.5rem}
h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em;margin-bottom:.75rem}
h3{font-size:1.05rem;font-weight:600;margin-bottom:.5rem}
label{font-size:.8125rem;font-weight:600;margin-bottom:.35rem;display:block;letter-spacing:.01em}
input[type="number"],select{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.65rem .85rem;font-size:.9375rem;width:100%;margin-bottom:.5rem;outline:none;font-family:var(--font);transition:border-color .2s}
input:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1)}
.btn{background:var(--accent);color:#fff;border:none;padding:.75rem 2rem;border-radius:var(--radius-sm);font-size:.9375rem;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .2s;margin:.75rem 0;width:100%}
.btn:hover{background:var(--accent-hover)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
@media(max-width:768px){.grid{grid-template-columns:1fr}}
.result-box{background:var(--accent-subtle);border:1px solid rgba(0,113,227,.15);border-radius:var(--radius-sm);padding:1.25rem;margin-top:1rem}
.result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:1rem}
.result-item{text-align:center;padding:1rem;background:var(--white);border-radius:var(--radius-sm);border:1px solid var(--border)}
.result-item .value{font-size:1.5rem;font-weight:700;color:var(--accent)}
.result-item .label{font-size:.75rem;color:var(--text-secondary);margin-top:.25rem}
.chart-container{position:relative;margin:1.5rem 0;height:300px;display:flex;align-items:flex-end;gap:2px;padding:1rem 0}
.chart-bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px}
.chart-bar{width:100%;border-radius:4px 4px 0 0;transition:height .5s ease;min-width:8px}
.chart-bar.contributions{background:var(--accent)}
.chart-bar.earnings{background:#34c759}
.chart-label{font-size:.6rem;color:var(--text-tertiary);text-align:center;margin-top:4px}
.legend{display:flex;gap:1.5rem;margin-top:.5rem;font-size:.8125rem}
.legend-item{display:flex;align-items:center;gap:.4rem}
.legend-dot{width:12px;height:12px;border-radius:3px}
table{width:100%;border-collapse:collapse;font-size:.875rem;margin:.75rem 0}
th{text-align:left;padding:.6rem .75rem;border-bottom:2px solid var(--border);color:var(--text-secondary);font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.03em}
td{padding:.6rem .75rem;border-bottom:1px solid var(--border)}
tr:hover{background:var(--accent-subtle)}
.tag{display:inline-block;padding:.25rem .6rem;background:var(--accent-subtle);color:var(--accent);border-radius:6px;font-size:.75rem;font-weight:600;margin:.25rem .25rem 0 0}
.tag.green{background:rgba(52,199,89,.1);color:#34c759}
.tag.orange{background:rgba(255,149,0,.1);color:#ff9500}
.info-row{display:flex;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--border);font-size:.875rem}
.info-row:last-child{border-bottom:none}
.info-row .lbl{color:var(--text-secondary)}.info-row .val{font-weight:600}
.faq-item{padding:1rem 0;border-bottom:1px solid var(--border)}
.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:600;font-size:.9375rem;margin-bottom:.5rem}
.faq-a{font-size:.875rem;color:var(--text-secondary);line-height:1.6}
.section{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem;margin-top:1.5rem}
.ad-slot{margin:1.5rem 0}
.footer{max-width:var(--max-w);margin:3rem auto 0;padding:2rem;text-align:center;font-size:.8125rem;color:var(--text-tertiary);border-top:1px solid var(--border)}
.footer a{color:var(--text-secondary)}
.footer a:hover{color:var(--accent)}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-top:1rem}
.related-card{padding:1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);transition:all .2s}
.related-card:hover{border-color:var(--accent);box-shadow:var(--shadow-md)}
.related-card h4{font-size:.875rem;margin-bottom:.25rem}
.related-card p{font-size:.75rem;color:var(--text-secondary)}
</style>
</head>
<body>
<nav class="cl-nav"><div class="cl-nav-inner"><a href="https://calcleap.com/" class="cl-logo">Calc<span>Leap</span></a><div class="cl-nav-links"><a href="https://calcleap.com/">Home</a><a href="https://calcleap.com/529/">529 Plans</a><a href="https://calcleap.com/about.html">About</a></div></div></nav>
<main>
<div class="breadcrumb"><a href="https://calcleap.com/">Home</a><span>›</span><a href="https://calcleap.com/529/">529 Plans</a><span>›</span>${state.name}</div>
<div class="hero">
<h1>${state.name} 529 College Savings Plan Calculator</h1>
<p>Calculate your ${state.plan} savings growth, tax benefits, and projected college costs for ${state.abbr} families. Free, instant results.</p>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<div class="card">
<h2>🎓 Calculate Your 529 Savings</h2>
<div class="grid">
<div>
<label for="childAge">Child's Current Age</label>
<select id="childAge">${Array.from({length:18},(_,i)=>`<option value="${i}"${i===3?' selected':''}>${i===0?'Newborn':i+' year'+(i>1?'s':'')}</option>`).join('')}</select>
<label for="collegeAge">College Start Age</label>
<select id="collegeAge"><option value="18" selected>18</option><option value="17">17</option><option value="19">19</option><option value="20">20</option></select>
<label for="currentSavings">Current 529 Balance ($)</label>
<input type="number" id="currentSavings" value="0" min="0" step="100">
<label for="monthlyContrib">Monthly Contribution ($)</label>
<input type="number" id="monthlyContrib" value="${Math.round(annualContrib/12/10)*10}" min="0" step="25">
</div>
<div>
<label for="lumpSum">Annual Lump Sum ($)</label>
<input type="number" id="lumpSum" value="0" min="0" step="100">
<label for="returnRate">Expected Annual Return (%)</label>
<select id="returnRate"><option value="4">Conservative (4%)</option><option value="6" selected>Moderate (6%)</option><option value="8">Aggressive (8%)</option><option value="10">Very Aggressive (10%)</option></select>
<label for="collegeCost">Annual College Cost ($)</label>
<input type="number" id="collegeCost" value="${state.costOfCollege}" min="0" step="100">
<label for="costInflation">College Cost Inflation (%)</label>
<select id="costInflation"><option value="3">Low (3%)</option><option value="5" selected>Average (5%)</option><option value="7">High (7%)</option></select>
</div>
</div>
<button class="btn" onclick="calculate()">Calculate My 529 Savings</button>
<div id="results" style="display:none">
<div class="result-grid" id="resultGrid"></div>
<div id="chartArea" style="margin-top:1.5rem"></div>
<div style="margin-top:1rem"><h3>Year-by-Year Growth</h3>
<div style="overflow-x:auto"><table id="growthTable"><thead><tr><th>Year</th><th>Age</th><th>Contributions</th><th>Earnings</th><th>Balance</th></tr></thead><tbody></tbody></table></div></div>
</div>
</div>

${hasDeduction ? `<div class="card">
<h2>💰 ${state.name} State Tax Benefits</h2>
<div class="info-row"><span class="lbl">State Plan</span><span class="val">${state.plan}</span></div>
<div class="info-row"><span class="lbl">Tax Deduction</span><span class="val">${state.deduction}</span></div>
<div class="info-row"><span class="lbl">Maximum Deduction</span><span class="val">${state.maxDeduction}</span></div>
<div class="info-row"><span class="lbl">State Tax Rate</span><span class="val">${state.taxRate}%</span></div>
<div class="info-row"><span class="lbl">Max Account Balance</span><span class="val">$${state.maxContrib.toLocaleString()}</span></div>
<div class="info-row"><span class="lbl">Plan Manager</span><span class="val">${state.mgr}</span></div>
<div class="result-box"><p style="font-size:.875rem">💡 <strong>${state.name} residents</strong> can deduct up to <strong>${state.maxDeduction}</strong> from state taxable income. At a ${state.taxRate}% state tax rate, that's real money back in your pocket every year.</p></div>
</div>` : `<div class="card">
<h2>💰 ${state.name} 529 Plan Details</h2>
<div class="info-row"><span class="lbl">State Plan</span><span class="val">${state.plan}</span></div>
<div class="info-row"><span class="lbl">State Tax Deduction</span><span class="val tag orange">Not Available</span></div>
<div class="info-row"><span class="lbl">Max Account Balance</span><span class="val">$${state.maxContrib.toLocaleString()}</span></div>
<div class="info-row"><span class="lbl">Plan Manager</span><span class="val">${state.mgr}</span></div>
<div class="result-box"><p style="font-size:.875rem">💡 While ${state.name} doesn't offer a state tax deduction for 529 contributions, your earnings still grow <strong>100% tax-free</strong> federally when used for qualified education expenses. You can also use <strong>any state's 529 plan</strong> — many offer lower fees.</p></div>
</div>`}

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<div class="section">
<h2>📊 ${state.name} College Cost Overview</h2>
<div class="info-row"><span class="lbl">Avg Annual College Cost (${state.abbr})</span><span class="val">$${state.costOfCollege.toLocaleString()}</span></div>
<div class="info-row"><span class="lbl">4-Year Total (Today)</span><span class="val">$${fourYearCost.toLocaleString()}</span></div>
<div class="info-row"><span class="lbl">4-Year Cost in 18 Years (5% inflation)</span><span class="val">$${costIn18Yrs.toLocaleString()}</span></div>
<p style="margin-top:1rem;font-size:.875rem;color:var(--text-secondary)">College costs in ${state.name} average <strong>$${state.costOfCollege.toLocaleString()}/year</strong> for in-state public universities (tuition + room & board). With college cost inflation averaging 5% annually, families starting today need to save significantly more than the current sticker price. Starting early with a 529 plan harnesses compound growth to close the gap.</p>
</div>

<div class="section">
<h2>📚 What Is a 529 Plan?</h2>
<p style="font-size:.875rem;color:var(--text-secondary);line-height:1.7">A 529 plan is a tax-advantaged savings plan designed to encourage saving for future education costs. Named after Section 529 of the Internal Revenue Code, these plans offer powerful tax benefits:</p>
<ul style="margin:1rem 0 0 1.5rem;font-size:.875rem;color:var(--text-secondary);line-height:1.8">
<li><strong>Tax-free growth</strong> — Investment earnings grow free from federal (and usually state) income tax</li>
<li><strong>Tax-free withdrawals</strong> — When used for qualified education expenses (tuition, room & board, books, computers)</li>
<li><strong>High contribution limits</strong> — ${state.name}'s plan allows up to $${state.maxContrib.toLocaleString()} per beneficiary</li>
<li><strong>Superfunding</strong> — Contribute up to 5x the annual gift tax exclusion ($90,000 single / $180,000 married in 2026) in one year</li>
<li><strong>K-12 tuition</strong> — Up to $10,000/year can be used for K-12 private school tuition</li>
<li><strong>Student loan repayment</strong> — Up to $10,000 lifetime can be used to repay student loans</li>
<li><strong>Roth IRA rollover</strong> — Starting 2024, unused 529 funds can roll to beneficiary's Roth IRA (up to $35,000 lifetime)</li>
</ul>
</div>

<div class="section">
<h2>🏆 ${state.plan} — Key Features</h2>
<div class="info-row"><span class="lbl">Plan Rating</span><span class="val">${'⭐'.repeat(state.rating)}${'☆'.repeat(5-state.rating)}</span></div>
<div class="info-row"><span class="lbl">Investment Manager</span><span class="val">${state.mgr}</span></div>
<div class="info-row"><span class="lbl">Maximum Balance</span><span class="val">$${state.maxContrib.toLocaleString()}</span></div>
<div class="info-row"><span class="lbl">Minimum Contribution</span><span class="val">$25 (most plans)</span></div>
<div class="info-row"><span class="lbl">Investment Options</span><span class="val">Age-based, static, individual funds</span></div>
<p style="margin-top:1rem;font-size:.875rem;color:var(--text-secondary)">The ${state.plan} offers age-based portfolios that automatically adjust from aggressive to conservative as your child approaches college age. Most plans also offer static allocation and individual fund options for hands-on investors.</p>
</div>

${hasDeduction ? `<div class="section">
<h2>🧮 ${state.name} Tax Savings Example</h2>
<p style="font-size:.875rem;color:var(--text-secondary);line-height:1.7">Here's how the ${state.abbr} state tax deduction can boost your savings:</p>
<table>
<thead><tr><th>Annual Contribution</th><th>State Tax Rate</th><th>Annual Tax Savings</th><th>18-Year Tax Savings</th></tr></thead>
<tbody>
<tr><td>$2,000</td><td>${state.taxRate}%</td><td>$${Math.round(2000*state.taxRate/100)}</td><td>$${Math.round(2000*state.taxRate/100*18).toLocaleString()}</td></tr>
<tr><td>$5,000</td><td>${state.taxRate}%</td><td>$${Math.round(5000*state.taxRate/100)}</td><td>$${Math.round(5000*state.taxRate/100*18).toLocaleString()}</td></tr>
<tr><td>$10,000</td><td>${state.taxRate}%</td><td>$${Math.round(10000*state.taxRate/100)}</td><td>$${Math.round(10000*state.taxRate/100*18).toLocaleString()}</td></tr>
</tbody>
</table>
<p style="margin-top:.75rem;font-size:.8125rem;color:var(--text-tertiary)">* Tax savings are approximate. Actual savings depend on your marginal tax rate and deduction limits.</p>
</div>` : ''}

<div class="section">
<h2>❓ Frequently Asked Questions</h2>
<div class="faq-item"><div class="faq-q">Can I use ${state.name}'s 529 plan for out-of-state colleges?</div><div class="faq-a">Yes! 529 plan funds can be used at any accredited college or university nationwide, as well as many international institutions. You're not limited to ${state.abbr} schools.</div></div>
<div class="faq-item"><div class="faq-q">What happens to unused 529 funds?</div><div class="faq-a">You have several options: change the beneficiary to another family member, use for K-12 tuition ($10K/year limit), pay student loans ($10K lifetime limit), or roll up to $35,000 into the beneficiary's Roth IRA (15-year account minimum). Non-qualified withdrawals incur income tax + 10% penalty on earnings only.</div></div>
<div class="faq-item"><div class="faq-q">How does ${state.name}'s 529 plan compare to other states?</div><div class="faq-a">${hasDeduction ? `${state.name} offers a state tax deduction of ${state.maxDeduction}, which is a significant benefit. Combined with the ${state.plan}'s ${state.rating >= 4 ? 'strong' : 'solid'} investment options from ${state.mgr}, it's ${state.rating >= 4 ? 'one of the better' : 'a competitive'} plans available.` : `While ${state.name} doesn't offer a state tax deduction, you can use any state's 529 plan. Many families in ${state.abbr} choose plans from Utah (my529), Nevada, or New York for their low fees and strong investment options.`}</div></div>
<div class="faq-item"><div class="faq-q">What counts as a qualified 529 expense?</div><div class="faq-a">Qualified expenses include: tuition and fees, room and board (on or off campus), books and supplies, computers and software, internet service, and special needs equipment. K-12 tuition (up to $10K/year) and student loan payments (up to $10K lifetime) also qualify.</div></div>
<div class="faq-item"><div class="faq-q">Can grandparents contribute to a ${state.abbr} 529 plan?</div><div class="faq-a">Absolutely! Anyone can contribute — parents, grandparents, aunts, uncles, friends. As of 2024, grandparent-owned 529 plans no longer impact financial aid eligibility on the FAFSA, making them an excellent estate planning tool.${hasDeduction ? ` In ${state.name}, the contributor (grandparent) can claim the state tax deduction.` : ''}</div></div>
<div class="faq-item"><div class="faq-q">When should I start saving in a 529 plan?</div><div class="faq-a">The earlier the better! Starting at birth gives you 18 years of compound growth. Even modest monthly contributions of $200-$400 can grow to $80,000-$160,000+ by college age. In ${state.name}, with average annual college costs of $${state.costOfCollege.toLocaleString()}, early and consistent saving is critical.</div></div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<div class="section">
<h2>🔗 Related Calculators</h2>
<div class="related-grid">
<a href="https://calcleap.com/calc/compound-interest-calculator.html" class="related-card"><h4>Compound Interest</h4><p>See how your investments grow over time</p></a>
<a href="https://calcleap.com/calc/student-loan-forgiveness.html" class="related-card"><h4>Student Loan Forgiveness</h4><p>PSLF and IDR forgiveness estimator</p></a>
<a href="https://calcleap.com/calc/roth-ira-calculator.html" class="related-card"><h4>Roth IRA Calculator</h4><p>Plan your tax-free retirement savings</p></a>
<a href="https://calcleap.com/calc/401k-calculator.html" class="related-card"><h4>401(k) Calculator</h4><p>Maximize your employer match</p></a>
<a href="https://calcleap.com/calc/investment-return-calculator.html" class="related-card"><h4>Investment Returns</h4><p>Calculate ROI on any investment</p></a>
<a href="https://calcleap.com/529/" class="related-card"><h4>All 529 Plans by State</h4><p>Compare plans across all 50 states</p></a>
</div>
</div>

</main>
<footer class="footer"><p>© 2026 <a href="https://calcleap.com/">CalcLeap</a> — Free Financial Calculators</p><p style="margin-top:.5rem"><a href="https://calcleap.com/about.html">About</a> · <a href="https://calcleap.com/privacy.html">Privacy</a> · <a href="https://calcleap.com/contact.html">Contact</a></p><p style="margin-top:.5rem;font-size:.75rem">Last updated: March 2026. Data is for educational purposes. Consult a financial advisor for personalized advice.</p></footer>
<script>
function fmt(n){return'$'+Math.round(n).toLocaleString()}
function calculate(){
  const childAge=+document.getElementById('childAge').value;
  const collegeAge=+document.getElementById('collegeAge').value;
  const current=+document.getElementById('currentSavings').value;
  const monthly=+document.getElementById('monthlyContrib').value;
  const lump=+document.getElementById('lumpSum').value;
  const rate=+document.getElementById('returnRate').value/100;
  const collegeCost=+document.getElementById('collegeCost').value;
  const inflation=+document.getElementById('costInflation').value/100;
  const years=Math.max(collegeAge-childAge,1);
  let balance=current,totalContrib=current,rows=[];
  for(let y=1;y<=years;y++){
    const annualContrib=monthly*12+lump;
    totalContrib+=annualContrib;
    balance=(balance+annualContrib)*(1+rate);
    const earnings=balance-totalContrib;
    rows.push({year:y,age:childAge+y,contrib:totalContrib,earnings:Math.max(0,earnings),balance});
  }
  const totalEarnings=balance-totalContrib;
  const projectedCost=collegeCost*((Math.pow(1+inflation,years+4)-Math.pow(1+inflation,years))/inflation);
  const coverage=Math.min(100,balance/projectedCost*100);
  const stateTaxSaved=${state.taxRate>0?`(monthly*12+lump)*${state.taxRate/100}*years`:0};
  document.getElementById('resultGrid').innerHTML=
    '<div class="result-item"><div class="value">'+fmt(balance)+'</div><div class="label">Total 529 Balance</div></div>'+
    '<div class="result-item"><div class="value">'+fmt(totalContrib)+'</div><div class="label">Total Contributions</div></div>'+
    '<div class="result-item"><div class="value">'+fmt(totalEarnings)+'</div><div class="label">Tax-Free Earnings</div></div>'+
    '<div class="result-item"><div class="value">'+fmt(projectedCost)+'</div><div class="label">Projected 4-Year Cost</div></div>'+
    '<div class="result-item"><div class="value">'+coverage.toFixed(1)+'%</div><div class="label">College Cost Coverage</div></div>'+
    (stateTaxSaved>0?'<div class="result-item"><div class="value">'+fmt(stateTaxSaved)+'</div><div class="label">State Tax Saved</div></div>':'');
  const maxBal=Math.max(...rows.map(r=>r.balance));
  let chartHtml='<h3>Savings Growth Chart</h3><div class="chart-container">';
  rows.forEach(r=>{
    const ch=Math.max(2,(r.contrib/maxBal)*260);
    const eh=Math.max(0,((r.balance-r.contrib)/maxBal)*260);
    chartHtml+='<div class="chart-bar-group"><div class="chart-bar earnings" style="height:'+eh+'px" title="Earnings: '+fmt(r.earnings)+'"></div><div class="chart-bar contributions" style="height:'+ch+'px" title="Contributions: '+fmt(r.contrib)+'"></div><div class="chart-label">'+(r.year%2===0||rows.length<=10?r.year:'')+'</div></div>';
  });
  chartHtml+='</div><div class="legend"><div class="legend-item"><div class="legend-dot" style="background:var(--accent)"></div>Contributions</div><div class="legend-item"><div class="legend-dot" style="background:#34c759"></div>Tax-Free Earnings</div></div>';
  document.getElementById('chartArea').innerHTML=chartHtml;
  const tbody=document.querySelector('#growthTable tbody');
  tbody.innerHTML='';
  rows.forEach(r=>{
    tbody.innerHTML+='<tr><td>'+r.year+'</td><td>'+r.age+'</td><td>'+fmt(r.contrib)+'</td><td>'+fmt(r.earnings)+'</td><td>'+fmt(r.balance)+'</td></tr>';
  });
  document.getElementById('results').style.display='block';
  document.getElementById('results').scrollIntoView({behavior:'smooth',block:'start'});
}
document.addEventListener('DOMContentLoaded',calculate);
</script>
</body>
</html>`};
}

function generateIndexPage() {
  const stateCards = states.map(s => {
    const slug = s.name.toLowerCase().replace(/\s+/g,'-').replace(/\./g,'');
    const hasDeduction = !s.deduction.includes('None');
    return `<tr>
<td><a href="${slug}.html" style="color:var(--accent);font-weight:600">${s.name}</a></td>
<td>${s.plan}</td>
<td>${hasDeduction?'<span class="tag green">Yes</span>':'<span class="tag orange">No</span>'}</td>
<td>${hasDeduction?s.maxDeduction:'—'}</td>
<td>$${s.maxContrib.toLocaleString()}</td>
<td>$${s.costOfCollege.toLocaleString()}</td>
<td>${'⭐'.repeat(s.rating)}</td>
</tr>`;
  }).join('');

  const featuredStates = states.filter(s=>['CA','NY','TX','FL','IL','PA','OH','NJ'].includes(s.abbr));
  const featuredCards = featuredStates.map(s=>{
    const slug = s.name.toLowerCase().replace(/\s+/g,'-').replace(/\./g,'');
    const hasDeduction = !s.deduction.includes('None');
    return `<a href="${slug}.html" class="related-card"><h4>🎓 ${s.name}</h4><p>${s.plan}</p><p style="margin-top:.25rem">${hasDeduction?'✅ Tax deduction: '+s.maxDeduction:'⚠️ No state tax deduction'}</p></a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>529 College Savings Plan Calculator by State — All 50 States | CalcLeap</title>
<meta name="description" content="Compare 529 college savings plans across all 50 states. Calculate tax benefits, growth projections, and find the best plan for your family.">
<link rel="canonical" href="https://calcleap.com/529/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"529 College Savings Plan Calculator by State","description":"Compare 529 plans across all 50 states with tax benefits, growth projections, and college cost estimates.","url":"https://calcleap.com/529/","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#fafafa;--surface:#fff;--border:rgba(0,0,0,.06);--border-hover:rgba(0,0,0,.12);--text:#1d1d1f;--text-secondary:#6e6e73;--text-tertiary:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-subtle:rgba(0,113,227,.06);--shadow-sm:0 1px 3px rgba(0,0,0,.04),0 1px 2px rgba(0,0,0,.06);--shadow-md:0 4px 16px rgba(0,0,0,.06),0 1px 4px rgba(0,0,0,.04);--radius:16px;--radius-sm:12px;--max-w:1120px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.5;letter-spacing:-.022em}
a{color:inherit;text-decoration:none}
.cl-nav{position:sticky;top:0;z-index:100;background:rgba(251,251,253,.72);backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.cl-nav-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px}
.cl-logo{font-size:1.15rem;font-weight:700;letter-spacing:-.02em}.cl-logo span{color:var(--accent)}
.cl-nav-links{display:flex;align-items:center;gap:.25rem}
.cl-nav-links a{font-size:.8125rem;font-weight:400;color:var(--text-secondary);padding:.5rem .75rem;border-radius:8px;transition:all .2s}
.cl-nav-links a:hover{color:var(--text);background:rgba(0,0,0,.03)}
main{max-width:var(--max-w);margin:0 auto;padding:1rem 2rem 3rem}
.breadcrumb{font-size:.8125rem;color:var(--text-tertiary);margin-bottom:.5rem;padding:.5rem 0}
.breadcrumb a{color:var(--text-secondary)}.breadcrumb a:hover{color:var(--accent)}
.breadcrumb span{margin:0 .4rem;opacity:.5}
.hero{text-align:left;padding:1rem 0 1.5rem}
.hero h1{font-size:2rem;font-weight:700;letter-spacing:-.03em}
.hero p{font-size:1rem;color:var(--text-secondary);max-width:640px;margin-top:.5rem}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;box-shadow:var(--shadow-sm);margin-bottom:1.5rem}
h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em;margin-bottom:.75rem}
.tag{display:inline-block;padding:.25rem .6rem;border-radius:6px;font-size:.75rem;font-weight:600}
.tag.green{background:rgba(52,199,89,.1);color:#34c759}
.tag.orange{background:rgba(255,149,0,.1);color:#ff9500}
table{width:100%;border-collapse:collapse;font-size:.8125rem;margin:.75rem 0}
th{text-align:left;padding:.6rem .75rem;border-bottom:2px solid var(--border);color:var(--text-secondary);font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.03em;cursor:pointer}
th:hover{color:var(--accent)}
td{padding:.6rem .75rem;border-bottom:1px solid var(--border)}
tr:hover{background:var(--accent-subtle)}
input[type="text"]{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.65rem .85rem;font-size:.9375rem;width:100%;margin-bottom:1rem;outline:none;font-family:var(--font)}
input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1)}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem;margin-top:1rem}
.related-card{padding:1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);transition:all .2s}
.related-card:hover{border-color:var(--accent);box-shadow:var(--shadow-md)}
.related-card h4{font-size:.875rem;margin-bottom:.25rem}
.related-card p{font-size:.75rem;color:var(--text-secondary)}
.section{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem;margin-top:1.5rem}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1rem 0}
.stat-card{text-align:center;padding:1.25rem;background:var(--accent-subtle);border-radius:var(--radius-sm)}
.stat-card .value{font-size:1.5rem;font-weight:700;color:var(--accent)}
.stat-card .label{font-size:.75rem;color:var(--text-secondary);margin-top:.25rem}
.ad-slot{margin:1.5rem 0}
.footer{max-width:var(--max-w);margin:3rem auto 0;padding:2rem;text-align:center;font-size:.8125rem;color:var(--text-tertiary);border-top:1px solid var(--border)}
.footer a{color:var(--text-secondary)}.footer a:hover{color:var(--accent)}
.faq-item{padding:1rem 0;border-bottom:1px solid var(--border)}.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:600;font-size:.9375rem;margin-bottom:.5rem}
.faq-a{font-size:.875rem;color:var(--text-secondary);line-height:1.6}
@media(max-width:768px){table{font-size:.7rem}td,th{padding:.4rem}}
</style>
</head>
<body>
<nav class="cl-nav"><div class="cl-nav-inner"><a href="https://calcleap.com/" class="cl-logo">Calc<span>Leap</span></a><div class="cl-nav-links"><a href="https://calcleap.com/">Home</a><a href="https://calcleap.com/529/">529 Plans</a><a href="https://calcleap.com/about.html">About</a></div></div></nav>
<main>
<div class="breadcrumb"><a href="https://calcleap.com/">Home</a><span>›</span>529 College Savings Plans</div>
<div class="hero">
<h1>529 College Savings Plan Calculator — All 50 States</h1>
<p>Compare 529 plans across every US state. Calculate tax benefits, savings growth, and projected college costs. Find the best plan for your family.</p>
</div>

<div class="stat-grid">
<div class="stat-card"><div class="value">35</div><div class="label">States with Tax Deduction</div></div>
<div class="stat-card"><div class="value">$529K</div><div class="label">Avg Max Balance</div></div>
<div class="stat-card"><div class="value">$27.4K</div><div class="label">Avg Annual College Cost</div></div>
<div class="stat-card"><div class="value">100%</div><div class="label">Tax-Free Growth</div></div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<div class="card">
<h2>🎓 Featured State Plans</h2>
<div class="related-grid">${featuredCards}</div>
</div>

<div class="card">
<h2>📊 All 50 States + DC</h2>
<input type="text" id="search" placeholder="Search by state name..." oninput="filterTable()">
<div style="overflow-x:auto">
<table id="stateTable">
<thead><tr><th onclick="sortTable(0)">State</th><th onclick="sortTable(1)">Plan Name</th><th onclick="sortTable(2)">Tax Deduction?</th><th onclick="sortTable(3)">Max Deduction</th><th onclick="sortTable(4)">Max Balance</th><th onclick="sortTable(5)">Avg College Cost</th><th onclick="sortTable(6)">Rating</th></tr></thead>
<tbody>${stateCards}</tbody>
</table>
</div>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<div class="section">
<h2>❓ Frequently Asked Questions</h2>
<div class="faq-item"><div class="faq-q">Do I have to use my own state's 529 plan?</div><div class="faq-a">No. You can use any state's 529 plan regardless of where you live. However, 35 states offer tax deductions or credits only for contributions to their own state's plan. If your state offers a deduction, use your state's plan first to capture the tax benefit.</div></div>
<div class="faq-item"><div class="faq-q">What's the best 529 plan overall?</div><div class="faq-a">The "best" plan depends on your state. If your state offers a tax deduction, your state's plan is usually the best starting point. For states without deductions (CA, DE, HI, KY, ME, NC), popular choices include Utah's my529, Nevada's Vanguard plan, and New York's Direct Plan — all known for low fees and strong investment options.</div></div>
<div class="faq-item"><div class="faq-q">Can I have multiple 529 plans?</div><div class="faq-a">Yes! There's no limit on the number of 529 accounts you can open. Many families open their state's plan (for the tax deduction) plus a second plan with lower fees or better investment options. Each beneficiary has their own contribution limits per state.</div></div>
<div class="faq-item"><div class="faq-q">What if my child doesn't go to college?</div><div class="faq-a">You have many options: change the beneficiary to a sibling, cousin, or even yourself; use for trade schools or apprenticeship programs; use up to $10K for K-12 tuition; pay up to $10K in student loans; or roll up to $35,000 into the beneficiary's Roth IRA (after 15 years). You can also simply withdraw funds (paying tax + 10% penalty on earnings only).</div></div>
<div class="faq-item"><div class="faq-q">How much should I save in a 529 plan?</div><div class="faq-a">A common goal is to save 1/3 of projected college costs (the other 2/3 coming from income, financial aid, and scholarships). For a 4-year public university, that's roughly $200-$400/month starting from birth. Use our state-specific calculators above to get a personalized projection.</div></div>
</div>

</main>
<footer class="footer"><p>© 2026 <a href="https://calcleap.com/">CalcLeap</a> — Free Financial Calculators</p><p style="margin-top:.5rem"><a href="https://calcleap.com/about.html">About</a> · <a href="https://calcleap.com/privacy.html">Privacy</a> · <a href="https://calcleap.com/contact.html">Contact</a></p></footer>
<script>
function filterTable(){const q=document.getElementById('search').value.toLowerCase();document.querySelectorAll('#stateTable tbody tr').forEach(r=>{r.style.display=r.cells[0].textContent.toLowerCase().includes(q)?'':'none'})}
function sortTable(n){const t=document.getElementById('stateTable'),rows=Array.from(t.tBodies[0].rows);let asc=t.dataset.sortCol==n?t.dataset.sortDir!=='asc':'true';rows.sort((a,b)=>{let x=a.cells[n].textContent,y=b.cells[n].textContent;const xn=parseFloat(x.replace(/[^0-9.-]/g,'')),yn=parseFloat(y.replace(/[^0-9.-]/g,''));if(!isNaN(xn)&&!isNaN(yn))return asc?xn-yn:yn-xn;return asc?x.localeCompare(y):y.localeCompare(x)});rows.forEach(r=>t.tBodies[0].appendChild(r));t.dataset.sortCol=n;t.dataset.sortDir=asc?'asc':'desc'}
</script>
</body>
</html>`;
}

// Generate all pages
let count = 0;
states.forEach(s => {
  const { slug, html } = generateStatePage(s);
  fs.writeFileSync(path.join(dir, `${slug}.html`), html);
  count++;
});

// Generate index
fs.writeFileSync(path.join(dir, 'index.html'), generateIndexPage());
count++;

console.log(`Generated ${count} pages in 529/`);
