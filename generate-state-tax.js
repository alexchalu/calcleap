const fs = require('fs');
const path = require('path');

const states = [
  { abbr: 'AL', name: 'Alabama', rate: '2-5%', brackets: '3 brackets', sales: '4%', property: '0.41%', notes: 'Graduated income tax' },
  { abbr: 'AK', name: 'Alaska', rate: '0%', brackets: 'No income tax', sales: '0%', property: '1.19%', notes: 'No state income or sales tax' },
  { abbr: 'AZ', name: 'Arizona', rate: '2.5%', brackets: 'Flat rate', sales: '5.6%', property: '0.62%', notes: 'Flat income tax since 2023' },
  { abbr: 'AR', name: 'Arkansas', rate: '2-4.7%', brackets: '3 brackets', sales: '6.5%', property: '0.62%', notes: 'Graduated income tax' },
  { abbr: 'CA', name: 'California', rate: '1-13.3%', brackets: '10 brackets', sales: '7.25%', property: '0.74%', notes: 'Highest state income tax rate' },
  { abbr: 'CO', name: 'Colorado', rate: '4.4%', brackets: 'Flat rate', sales: '2.9%', property: '0.51%', notes: 'Flat income tax' },
  { abbr: 'CT', name: 'Connecticut', rate: '3-6.99%', brackets: '7 brackets', sales: '6.35%', property: '2.14%', notes: 'Graduated income tax' },
  { abbr: 'DE', name: 'Delaware', rate: '2.2-6.6%', brackets: '7 brackets', sales: '0%', property: '0.57%', notes: 'No sales tax state' },
  { abbr: 'FL', name: 'Florida', rate: '0%', brackets: 'No income tax', sales: '6%', property: '0.89%', notes: 'No state income tax' },
  { abbr: 'GA', name: 'Georgia', rate: '5.49%', brackets: 'Flat rate', sales: '4%', property: '0.92%', notes: 'Moving to flat tax' },
  { abbr: 'HI', name: 'Hawaii', rate: '1.4-11%', brackets: '12 brackets', sales: '4%', property: '0.28%', notes: 'High income tax, low property tax' },
  { abbr: 'ID', name: 'Idaho', rate: '5.8%', brackets: 'Flat rate', sales: '6%', property: '0.69%', notes: 'Flat income tax since 2023' },
  { abbr: 'IL', name: 'Illinois', rate: '4.95%', brackets: 'Flat rate', sales: '6.25%', property: '2.27%', notes: 'Flat tax, high property taxes' },
  { abbr: 'IN', name: 'Indiana', rate: '3.05%', brackets: 'Flat rate', sales: '7%', property: '0.85%', notes: 'Low flat income tax' },
  { abbr: 'IA', name: 'Iowa', rate: '4.4-5.7%', brackets: '4 brackets', sales: '6%', property: '1.57%', notes: 'Graduated income tax' },
  { abbr: 'KS', name: 'Kansas', rate: '3.1-5.7%', brackets: '3 brackets', sales: '6.5%', property: '1.41%', notes: 'Graduated income tax' },
  { abbr: 'KY', name: 'Kentucky', rate: '4%', brackets: 'Flat rate', sales: '6%', property: '0.86%', notes: 'Flat income tax' },
  { abbr: 'LA', name: 'Louisiana', rate: '1.85-4.25%', brackets: '3 brackets', sales: '4.45%', property: '0.55%', notes: 'Graduated income tax' },
  { abbr: 'ME', name: 'Maine', rate: '5.8-7.15%', brackets: '3 brackets', sales: '5.5%', property: '1.36%', notes: 'Graduated income tax' },
  { abbr: 'MD', name: 'Maryland', rate: '2-5.75%', brackets: '8 brackets', sales: '6%', property: '1.07%', notes: 'Plus county tax up to 3.2%' },
  { abbr: 'MA', name: 'Massachusetts', rate: '5%', brackets: 'Flat rate', sales: '6.25%', property: '1.23%', notes: 'Flat tax + 4% surtax over $1M' },
  { abbr: 'MI', name: 'Michigan', rate: '4.25%', brackets: 'Flat rate', sales: '6%', property: '1.54%', notes: 'Flat income tax' },
  { abbr: 'MN', name: 'Minnesota', rate: '5.35-9.85%', brackets: '4 brackets', sales: '6.875%', property: '1.12%', notes: 'High income tax state' },
  { abbr: 'MS', name: 'Mississippi', rate: '0-5%', brackets: '2 brackets', sales: '7%', property: '0.81%', notes: 'Phasing out income tax on first $10K' },
  { abbr: 'MO', name: 'Missouri', rate: '2-4.95%', brackets: '10 brackets', sales: '4.225%', property: '0.97%', notes: 'Graduated income tax' },
  { abbr: 'MT', name: 'Montana', rate: '4.7-6.75%', brackets: '2 brackets', sales: '0%', property: '0.84%', notes: 'No sales tax state' },
  { abbr: 'NE', name: 'Nebraska', rate: '2.46-5.84%', brackets: '4 brackets', sales: '5.5%', property: '1.73%', notes: 'Graduated income tax' },
  { abbr: 'NV', name: 'Nevada', rate: '0%', brackets: 'No income tax', sales: '6.85%', property: '0.60%', notes: 'No state income tax' },
  { abbr: 'NH', name: 'New Hampshire', rate: '0%', brackets: 'No income tax', sales: '0%', property: '2.18%', notes: 'No income or sales tax, high property tax' },
  { abbr: 'NJ', name: 'New Jersey', rate: '1.4-10.75%', brackets: '7 brackets', sales: '6.625%', property: '2.49%', notes: 'Highest property tax in US' },
  { abbr: 'NM', name: 'New Mexico', rate: '1.7-5.9%', brackets: '4 brackets', sales: '5.125%', property: '0.80%', notes: 'Graduated income tax' },
  { abbr: 'NY', name: 'New York', rate: '4-10.9%', brackets: '9 brackets', sales: '4%', property: '1.72%', notes: 'Plus NYC tax up to 3.876%' },
  { abbr: 'NC', name: 'North Carolina', rate: '4.5%', brackets: 'Flat rate', sales: '4.75%', property: '0.84%', notes: 'Flat income tax, declining rate' },
  { abbr: 'ND', name: 'North Dakota', rate: '0-2.5%', brackets: '2 brackets', sales: '5%', property: '0.98%', notes: 'Very low income tax' },
  { abbr: 'OH', name: 'Ohio', rate: '0-3.5%', brackets: '2 brackets', sales: '5.75%', property: '1.56%', notes: 'No tax on first $26,050' },
  { abbr: 'OK', name: 'Oklahoma', rate: '0.25-4.75%', brackets: '6 brackets', sales: '4.5%', property: '0.90%', notes: 'Graduated income tax' },
  { abbr: 'OR', name: 'Oregon', rate: '4.75-9.9%', brackets: '4 brackets', sales: '0%', property: '0.97%', notes: 'No sales tax state, high income tax' },
  { abbr: 'PA', name: 'Pennsylvania', rate: '3.07%', brackets: 'Flat rate', sales: '6%', property: '1.58%', notes: 'Lowest flat income tax' },
  { abbr: 'RI', name: 'Rhode Island', rate: '3.75-5.99%', brackets: '3 brackets', sales: '7%', property: '1.63%', notes: 'Graduated income tax' },
  { abbr: 'SC', name: 'South Carolina', rate: '0-6.4%', brackets: '3 brackets', sales: '6%', property: '0.57%', notes: 'Graduated income tax' },
  { abbr: 'SD', name: 'South Dakota', rate: '0%', brackets: 'No income tax', sales: '4.5%', property: '1.28%', notes: 'No state income tax' },
  { abbr: 'TN', name: 'Tennessee', rate: '0%', brackets: 'No income tax', sales: '7%', property: '0.71%', notes: 'No state income tax' },
  { abbr: 'TX', name: 'Texas', rate: '0%', brackets: 'No income tax', sales: '6.25%', property: '1.80%', notes: 'No state income tax, high property tax' },
  { abbr: 'UT', name: 'Utah', rate: '4.65%', brackets: 'Flat rate', sales: '6.1%', property: '0.58%', notes: 'Flat income tax' },
  { abbr: 'VT', name: 'Vermont', rate: '3.35-8.75%', brackets: '4 brackets', sales: '6%', property: '1.90%', notes: 'Graduated income tax' },
  { abbr: 'VA', name: 'Virginia', rate: '2-5.75%', brackets: '4 brackets', sales: '5.3%', property: '0.82%', notes: 'Graduated income tax' },
  { abbr: 'WA', name: 'Washington', rate: '0%', brackets: 'No income tax', sales: '6.5%', property: '1.03%', notes: 'No income tax + 7% capital gains tax' },
  { abbr: 'WV', name: 'West Virginia', rate: '2.36-5.12%', brackets: '5 brackets', sales: '6%', property: '0.58%', notes: 'Gradually reducing rates' },
  { abbr: 'WI', name: 'Wisconsin', rate: '3.5-7.65%', brackets: '4 brackets', sales: '5%', property: '1.85%', notes: 'Graduated income tax' },
  { abbr: 'WY', name: 'Wyoming', rate: '0%', brackets: 'No income tax', sales: '4%', property: '0.61%', notes: 'No state income tax' },
];

function slug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function generatePage(state) {
  const s = slug(state.name);
  const hasIncomeTax = state.rate !== '0%';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${state.name} Tax Calculator 2026 — Income, Sales & Property Tax | CalcLeap</title>
<meta name="description" content="Calculate your ${state.name} taxes for 2026. ${hasIncomeTax ? `Income tax rate: ${state.rate}.` : 'No state income tax!'} Sales tax: ${state.sales}. Property tax: ${state.property}. Free calculator with detailed breakdown.">
<meta name="keywords" content="${state.name} tax calculator, ${state.abbr} income tax, ${state.name} sales tax, ${state.name} property tax, ${state.name} tax rate 2026">
<link rel="canonical" href="https://calcleap.com/${s}-tax.html">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebApplication","name":"${state.name} Tax Calculator","url":"https://calcleap.com/${s}-tax.html","applicationCategory":"FinanceApplication","operatingSystem":"All","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Calculate ${state.name} income tax, sales tax, and property tax for 2026."}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the ${state.name} income tax rate in 2026?","acceptedAnswer":{"@type":"Answer","text":"${hasIncomeTax ? `${state.name} has an income tax rate of ${state.rate} (${state.brackets}).` : `${state.name} has no state income tax.`} ${state.notes}."}},{"@type":"Question","name":"What is the ${state.name} sales tax rate?","acceptedAnswer":{"@type":"Answer","text":"The ${state.name} state sales tax rate is ${state.sales}. Local jurisdictions may add additional sales tax."}},{"@type":"Question","name":"What is the average ${state.name} property tax rate?","acceptedAnswer":{"@type":"Answer","text":"The average effective property tax rate in ${state.name} is ${state.property} of assessed home value."}}]}
</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0a;--surface:#141414;--border:#252525;--text:#e0e0e0;--muted:#888;--accent:#4f8ff7;--accent2:#22c55e;--red:#ef4444}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:800px;margin:0 auto;padding:20px}
h1{font-size:1.8rem;margin-bottom:8px}
.subtitle{color:var(--muted);margin-bottom:24px;font-size:0.95rem}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:20px}
.card h2{font-size:1.2rem;margin-bottom:16px;color:var(--accent)}
.tax-overview{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.tax-stat{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:16px;text-align:center}
.tax-stat .label{font-size:0.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
.tax-stat .value{font-size:1.5rem;font-weight:700;margin-top:4px}
.tax-stat .value.green{color:var(--accent2)}
.tax-stat .value.red{color:var(--red)}
.tax-stat .value.blue{color:var(--accent)}
label{display:block;font-size:0.85rem;color:var(--muted);margin-bottom:4px}
input,select{width:100%;padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:1rem;margin-bottom:12px}
input:focus{border-color:var(--accent);outline:none}
button{background:var(--accent);color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:1rem;cursor:pointer;width:100%;font-weight:600}
button:hover{opacity:0.9}
.result{margin-top:16px;padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:8px}
.result-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)}
.result-row:last-child{border-bottom:none;font-weight:700;font-size:1.1rem;color:var(--accent)}
.result-row .label{color:var(--muted)}
table{width:100%;border-collapse:collapse;margin-top:12px}
th,td{padding:10px 12px;text-align:left;border-bottom:1px solid var(--border)}
th{color:var(--muted);font-size:0.8rem;text-transform:uppercase}
.faq{margin-top:20px}
.faq h3{font-size:1rem;margin-bottom:8px;color:var(--text)}
.faq p{color:var(--muted);margin-bottom:16px;font-size:0.9rem}
.breadcrumb{font-size:0.85rem;color:var(--muted);margin-bottom:16px}
.breadcrumb a{color:var(--accent);text-decoration:none}
.related{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px}
.related a{display:block;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);text-decoration:none;font-size:0.9rem}
.related a:hover{border-color:var(--accent)}
.ad-slot{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin:16px 0;min-height:90px;text-align:center}
footer{text-align:center;padding:24px;color:var(--muted);font-size:0.8rem;border-top:1px solid var(--border);margin-top:32px}
footer a{color:var(--accent);text-decoration:none}
@media(max-width:600px){h1{font-size:1.4rem}.tax-overview{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="container">
<div class="breadcrumb"><a href="/toolpulse/">CalcLeap</a> → <a href="/toolpulse/federal-income-tax.html">Tax Calculators</a> → ${state.name}</div>
<h1>${state.name} Tax Calculator 2026</h1>
<p class="subtitle">${state.notes}. Calculate your ${state.abbr} income tax, sales tax, and property tax.</p>

<div class="ad-slot">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>


</div>

<div class="tax-overview">
<div class="tax-stat"><div class="label">Income Tax</div><div class="value ${hasIncomeTax ? 'blue' : 'green'}">${state.rate}</div></div>
<div class="tax-stat"><div class="label">Sales Tax</div><div class="value ${state.sales === '0%' ? 'green' : 'blue'}">${state.sales}</div></div>
<div class="tax-stat"><div class="label">Avg Property Tax</div><div class="value ${parseFloat(state.property) > 1.5 ? 'red' : 'blue'}">${state.property}</div></div>
<div class="tax-stat"><div class="label">Tax Structure</div><div class="value blue" style="font-size:1rem">${state.brackets}</div></div>
</div>

<div class="card">
<h2>📊 ${state.name} Income Tax Calculator</h2>
${hasIncomeTax ? `
<label>Annual Gross Income ($)</label>
<input type="number" id="income" value="75000" min="0">
<label>Filing Status</label>
<select id="filing">
<option value="single">Single</option>
<option value="married">Married Filing Jointly</option>
<option value="head">Head of Household</option>
</select>
<label>Federal Deductions ($)</label>
<input type="number" id="deductions" value="14600" min="0">
<button onclick="calculate()">Calculate ${state.abbr} Tax</button>
<div class="result" id="result" style="display:none"></div>
` : `
<div class="result">
<p style="font-size:1.1rem;text-align:center;padding:20px">🎉 <strong>${state.name} has no state income tax!</strong></p>
<p style="text-align:center;color:var(--muted)">You won't owe any state income tax on wages, salaries, or other earned income in ${state.name}.</p>
</div>
`}
</div>

<div class="card">
<h2>🛒 ${state.name} Sales Tax Calculator</h2>
<label>Purchase Amount ($)</label>
<input type="number" id="purchase" value="100" min="0" step="0.01">
<label>Local Tax Rate (%) — check your city/county</label>
<input type="number" id="localTax" value="0" min="0" max="10" step="0.1">
<button onclick="calcSales()">Calculate Sales Tax</button>
<div class="result" id="salesResult" style="display:none"></div>
</div>

<div class="card">
<h2>🏠 ${state.name} Property Tax Calculator</h2>
<label>Home Value ($)</label>
<input type="number" id="homeValue" value="350000" min="0">
<label>Assessment Ratio (%) — ${state.name} average</label>
<input type="number" id="assessRatio" value="100" min="0" max="100">
<button onclick="calcProperty()">Calculate Property Tax</button>
<div class="result" id="propResult" style="display:none"></div>
</div>

<div class="ad-slot">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>


</div>

<div class="card">
<h2>📋 ${state.name} Tax Overview</h2>
<table>
<tr><th>Tax Type</th><th>Rate</th><th>Details</th></tr>
<tr><td>Income Tax</td><td><strong>${state.rate}</strong></td><td>${state.brackets}</td></tr>
<tr><td>Sales Tax (state)</td><td><strong>${state.sales}</strong></td><td>Local taxes may apply</td></tr>
<tr><td>Property Tax (avg)</td><td><strong>${state.property}</strong></td><td>Of assessed value</td></tr>
</table>
</div>

<div class="card faq">
<h2>❓ Frequently Asked Questions</h2>
<h3>What is the ${state.name} income tax rate in 2026?</h3>
<p>${hasIncomeTax ? `${state.name} has a state income tax rate of ${state.rate} with ${state.brackets.toLowerCase()}. ${state.notes}.` : `${state.name} does not levy a state income tax. Residents keep 100% of their earned income from state taxation.`}</p>
<h3>What is the ${state.name} sales tax rate?</h3>
<p>The ${state.name} state sales tax rate is ${state.sales}. However, cities and counties may add local sales taxes, so the total rate you pay could be higher. Always check the combined rate for your specific location.</p>
<h3>How much is property tax in ${state.name}?</h3>
<p>The average effective property tax rate in ${state.name} is ${state.property} of your home's assessed value. For a $350,000 home, that's approximately $${Math.round(350000 * parseFloat(state.property) / 100).toLocaleString()} per year. Actual rates vary by county and municipality.</p>
<h3>Is ${state.name} a tax-friendly state?</h3>
<p>${hasIncomeTax ? 
  (parseFloat(state.rate.split('-').pop()) > 7 ? `${state.name} is considered a higher-tax state with income tax rates up to ${state.rate}. However, the overall tax burden depends on sales tax, property tax, and cost of living.` :
  `${state.name} has moderate tax rates with income tax at ${state.rate}. Combined with ${state.sales} sales tax and ${state.property} average property tax, the overall tax burden is reasonable compared to many states.`) :
  `${state.name} is very tax-friendly — it has no state income tax! However, the state may offset this with ${state.sales !== '0%' ? `a ${state.sales} sales tax rate` : 'other taxes'} and ${parseFloat(state.property) > 1.2 ? 'above-average' : 'moderate'} property taxes at ${state.property}.`
}</p>
</div>

<div class="card">
<h2>🗺️ Other State Tax Calculators</h2>
<div class="related" id="relatedStates"></div>
</div>

<div class="ad-slot">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>


</div>

<footer>
<p><a href="/toolpulse/">← Back to CalcLeap</a> · <a href="/smartcalc/">SmartCalc Financial Calculators</a></p>
<p style="margin-top:8px">© 2026 CalcLeap. Free online tools & calculators.</p>
</footer>
</div>

<script>
const stateRate = '${state.rate}';
const stateName = '${state.name}';
const hasIncomeTax = ${hasIncomeTax};
const stateSales = ${parseFloat(state.sales)};
const stateProp = ${parseFloat(state.property)};

function fmt(n){return '$'+n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g,',')}

${hasIncomeTax ? `
function calculate(){
  const income = parseFloat(document.getElementById('income').value)||0;
  const ded = parseFloat(document.getElementById('deductions').value)||0;
  const taxable = Math.max(0, income - ded);
  // Simplified: use midpoint of rate range
  const rates = stateRate.match(/[\\d.]+/g).map(Number);
  const effRate = rates.length > 1 ? (rates[0]+rates[rates.length-1])/2/100 : rates[0]/100;
  const stateTax = taxable * effRate;
  const fedTax = taxable * 0.22; // Simplified federal estimate
  const totalTax = stateTax + fedTax;
  const takeHome = income - totalTax;
  
  document.getElementById('result').style.display='block';
  document.getElementById('result').innerHTML=
    '<div class="result-row"><span class="label">Gross Income</span><span>'+fmt(income)+'</span></div>'+
    '<div class="result-row"><span class="label">Deductions</span><span>-'+fmt(ded)+'</span></div>'+
    '<div class="result-row"><span class="label">Taxable Income</span><span>'+fmt(taxable)+'</span></div>'+
    '<div class="result-row"><span class="label">${state.abbr} State Tax (est ~'+(rates.length>1?(rates[0]+rates[rates.length-1])/2:rates[0])+'%)</span><span>'+fmt(stateTax)+'</span></div>'+
    '<div class="result-row"><span class="label">Federal Tax (est ~22%)</span><span>'+fmt(fedTax)+'</span></div>'+
    '<div class="result-row"><span class="label">Estimated Take-Home</span><span>'+fmt(takeHome)+'</span></div>';
}
calculate();
` : ''}

function calcSales(){
  const amt = parseFloat(document.getElementById('purchase').value)||0;
  const local = parseFloat(document.getElementById('localTax').value)||0;
  const combined = stateSales + local;
  const tax = amt * combined / 100;
  document.getElementById('salesResult').style.display='block';
  document.getElementById('salesResult').innerHTML=
    '<div class="result-row"><span class="label">Purchase Amount</span><span>'+fmt(amt)+'</span></div>'+
    '<div class="result-row"><span class="label">State Tax (${state.sales})</span><span>'+fmt(amt*stateSales/100)+'</span></div>'+
    '<div class="result-row"><span class="label">Local Tax ('+local+'%)</span><span>'+fmt(amt*local/100)+'</span></div>'+
    '<div class="result-row"><span class="label">Total with Tax</span><span>'+fmt(amt+tax)+'</span></div>';
}

function calcProperty(){
  const val = parseFloat(document.getElementById('homeValue').value)||0;
  const ratio = parseFloat(document.getElementById('assessRatio').value)||100;
  const assessed = val * ratio / 100;
  const annual = assessed * stateProp / 100;
  document.getElementById('propResult').style.display='block';
  document.getElementById('propResult').innerHTML=
    '<div class="result-row"><span class="label">Home Value</span><span>'+fmt(val)+'</span></div>'+
    '<div class="result-row"><span class="label">Assessed Value ('+ratio+'%)</span><span>'+fmt(assessed)+'</span></div>'+
    '<div class="result-row"><span class="label">Annual Property Tax</span><span>'+fmt(annual)+'</span></div>'+
    '<div class="result-row"><span class="label">Monthly Property Tax</span><span>'+fmt(annual/12)+'</span></div>';
}

// Populate related states
const allStates = ${JSON.stringify(states.map(s => ({name: s.name, slug: slug(s.name), rate: s.rate})))};
const current = '${state.name}';
const related = allStates.filter(s=>s.name!==current).sort(()=>Math.random()-0.5).slice(0,8);
document.getElementById('relatedStates').innerHTML = related.map(s=>
  '<a href="/toolpulse/'+s.slug+'-tax.html">'+s.name+' Tax Calculator<br><small style="color:var(--muted)">Income: '+s.rate+'</small></a>'
).join('');
</script>
</body>
</html>`;
}

// Generate all 50 state pages
let generated = 0;
states.forEach(state => {
  const filename = `${slug(state.name)}-tax.html`;
  fs.writeFileSync(path.join(__dirname, filename), generatePage(state));
  generated++;
});

// Generate index page for state taxes
const indexPage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>All 50 State Tax Calculators 2026 — Income, Sales & Property Tax | CalcLeap</title>
<meta name="description" content="Free tax calculators for all 50 US states. Calculate income tax, sales tax, and property tax for 2026. Compare state tax rates side by side.">
<link rel="canonical" href="https://calcleap.com/state-taxes.html">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CollectionPage","name":"All 50 State Tax Calculators","url":"https://calcleap.com/state-taxes.html","description":"Tax calculators for every US state — income, sales, and property tax."}
</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0a;--surface:#141414;--border:#252525;--text:#e0e0e0;--muted:#888;--accent:#4f8ff7;--accent2:#22c55e;--red:#ef4444}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:1000px;margin:0 auto;padding:20px}
h1{font-size:1.8rem;margin-bottom:8px}
.subtitle{color:var(--muted);margin-bottom:24px}
.search{width:100%;padding:12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:1rem;margin-bottom:24px}
.search:focus{border-color:var(--accent);outline:none}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.state-card{display:block;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;text-decoration:none;color:var(--text);transition:border-color .2s}
.state-card:hover{border-color:var(--accent)}
.state-card h3{font-size:1rem;margin-bottom:8px}
.state-card .rates{display:flex;gap:12px;flex-wrap:wrap}
.state-card .rate{font-size:0.8rem;color:var(--muted)}
.state-card .rate strong{color:var(--text);font-size:0.9rem}
.no-tax{color:var(--accent2)}
.ad-slot{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin:20px 0;min-height:90px;text-align:center}
footer{text-align:center;padding:24px;color:var(--muted);font-size:0.8rem;border-top:1px solid var(--border);margin-top:32px}
footer a{color:var(--accent);text-decoration:none}
</style>
</head>
<body>
<div class="container">
<h1>🗺️ All 50 State Tax Calculators — 2026</h1>
<p class="subtitle">Calculate income tax, sales tax, and property tax for any US state. Click a state for the full calculator.</p>
<div class="ad-slot">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>


</div>
<input type="text" class="search" id="search" placeholder="Search states... (e.g. California, Texas, New York)">
<div class="grid" id="grid">
${states.map(s => `<a class="state-card" href="/toolpulse/${slug(s.name)}-tax.html" data-name="${s.name.toLowerCase()}">
<h3>${s.name} (${s.abbr})</h3>
<div class="rates">
<div class="rate">Income: <strong ${s.rate === '0%' ? 'class="no-tax"' : ''}>${s.rate}</strong></div>
<div class="rate">Sales: <strong ${s.sales === '0%' ? 'class="no-tax"' : ''}>${s.sales}</strong></div>
<div class="rate">Property: <strong>${s.property}</strong></div>
</div>
</a>`).join('\n')}
</div>
<div class="ad-slot">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>


</div>
<footer>
<p><a href="/toolpulse/">← Back to CalcLeap</a> · <a href="/smartcalc/">SmartCalc Financial Calculators</a></p>
<p style="margin-top:8px">© 2026 CalcLeap. Free online tools & calculators.</p>
</footer>
</div>
<script>
document.getElementById('search').addEventListener('input', function(){
  const q = this.value.toLowerCase();
  document.querySelectorAll('.state-card').forEach(c => {
    c.style.display = c.dataset.name.includes(q) ? '' : 'none';
  });
});
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'state-taxes.html'), indexPage);
generated++;

console.log('Generated ' + generated + ' files (50 state tax pages + 1 index)');
