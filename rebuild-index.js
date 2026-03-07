#!/usr/bin/env node
const fs = require('fs');
const AD = 'ca-pub-3112605892426625';
const BASE = 'https://alexchalu.github.io/toolpulse';

const categories = [
    {
        name: '💰 Financial Calculators',
        id: 'finance',
        tools: [
            { name: 'Mortgage Payment', desc: 'Monthly payment with taxes & PMI', url: 'calc/mortgage-payment.html' },
            { name: 'Paycheck Calculator', desc: 'Take-home pay after taxes', url: 'calc/paycheck-calculator.html' },
            { name: 'Personal Loan', desc: 'Loan payments & amortization', url: 'calc/personal-loan-calculator.html' },
            { name: 'Student Loan', desc: 'Student debt payoff timeline', url: 'calc/student-loan-calculator.html' },
            { name: 'ROI Calculator', desc: 'Return on investment', url: 'calc/roi-calculator.html' },
            { name: 'Profit Margin', desc: 'Margin & markup calculator', url: 'calc/margin-calculator.html' },
            { name: 'Rent vs Buy', desc: 'Should you rent or buy?', url: 'calc/rent-vs-buy.html' },
            { name: 'Salary to Hourly', desc: 'Convert salary ↔ hourly rate', url: 'calc/salary-to-hourly.html' },
            { name: 'Hourly to Salary', desc: 'Annual salary from hourly wage', url: 'calc/hourly-to-salary.html' },
            { name: 'Sales Tax', desc: 'Calculate total with tax', url: 'calc/sales-tax-calculator.html' },
            { name: 'Discount Calculator', desc: 'Sale price & savings', url: 'calc/discount-calculator.html' },
            { name: 'Tip Calculator', desc: 'Split bills & calculate tips', url: 'calc/tip-calculator.html' },
            { name: 'Percentage Calculator', desc: 'What is X% of Y?', url: 'calc/percentage-calculator.html' },
        ]
    },
    {
        name: '⚖️ Health & Fitness',
        id: 'health',
        tools: [
            { name: 'BMI Calculator', desc: 'Body Mass Index', url: 'calc/bmi-calculator.html' },
            { name: 'Calorie Calculator', desc: 'Daily calorie needs + macros', url: 'calc/calorie-calculator.html' },
            { name: 'Body Fat Calculator', desc: 'Navy method body fat %', url: 'calc/body-fat-calculator.html' },
            { name: 'Ideal Weight', desc: '4 medical formulas', url: 'calc/ideal-weight.html' },
            { name: 'Pregnancy Due Date', desc: 'Estimated delivery date', url: 'calc/pregnancy-due-date.html' },
        ]
    },
    {
        name: '📐 Math & Science',
        id: 'math',
        tools: [
            { name: 'Fraction Calculator', desc: 'Add, subtract, multiply fractions', url: 'calc/fraction-calculator.html' },
            { name: 'Square Root', desc: 'Square & cube roots', url: 'calc/square-root-calculator.html' },
            { name: 'Scientific Notation', desc: 'Convert to/from sci notation', url: 'calc/scientific-notation.html' },
            { name: 'GPA Calculator', desc: 'Cumulative grade point average', url: 'calc/gpa-calculator.html' },
        ]
    },
    {
        name: '📏 Unit Converters',
        id: 'convert',
        tools: [
            { name: 'Inches ↔ CM', desc: 'Length conversion', url: 'calc/inches-to-cm.html' },
            { name: 'Pounds ↔ KG', desc: 'Weight conversion', url: 'calc/lbs-to-kg.html' },
            { name: '°F ↔ °C', desc: 'Temperature conversion', url: 'calc/fahrenheit-to-celsius.html' },
            { name: 'KM ↔ Miles', desc: 'Distance conversion', url: 'calc/km-to-miles.html' },
        ]
    },
    {
        name: '💱 Currency Converter',
        id: 'currency',
        tools: [
            { name: 'USD to EUR', url: 'convert-usd-to-eur.html', desc: 'US Dollar → Euro' },
            { name: 'USD to GBP', url: 'convert-usd-to-gbp.html', desc: 'US Dollar → British Pound' },
            { name: 'USD to JPY', url: 'convert-usd-to-jpy.html', desc: 'US Dollar → Japanese Yen' },
            { name: 'USD to INR', url: 'convert-usd-to-inr.html', desc: 'US Dollar → Indian Rupee' },
            { name: 'EUR to GBP', url: 'convert-eur-to-gbp.html', desc: 'Euro → British Pound' },
            { name: 'GBP to USD', url: 'convert-gbp-to-usd.html', desc: 'British Pound → US Dollar' },
        ]
    },
    {
        name: '📅 Date & Time',
        id: 'datetime',
        tools: [
            { name: 'Age Calculator', desc: 'Your exact age', url: 'calc/age-calculator.html' },
            { name: 'Date Difference', desc: 'Days between dates', url: 'calc/date-difference.html' },
            { name: 'Days Until', desc: 'Countdown to any date', url: 'calc/days-until.html' },
            { name: 'Hours Calculator', desc: 'Time between hours', url: 'calc/hours-calculator.html' },
            { name: 'Time Zone Converter', desc: 'Convert world time zones', url: 'calc/time-zone-converter.html' },
            { name: 'Countdown Timer', desc: 'Timer & stopwatch', url: 'calc/countdown-timer.html' },
        ]
    },
    {
        name: '🏠 Home & Auto',
        id: 'home',
        tools: [
            { name: 'Gas Mileage (MPG)', desc: 'Fuel economy calculator', url: 'calc/gas-mileage-calculator.html' },
            { name: 'Electricity Cost', desc: 'Appliance energy costs', url: 'calc/electricity-cost.html' },
        ]
    },
    {
        name: '🔧 Developer Tools',
        id: 'dev',
        tools: [
            { name: 'JSON Formatter', desc: 'Format & validate JSON', url: 'json-formatter.html' },
            { name: 'Base64 Encoder', desc: 'Encode/decode Base64', url: 'base64-encoder-decoder.html' },
            { name: 'Hash Generator', desc: 'MD5, SHA-1, SHA-256', url: 'hash-generator.html' },
            { name: 'UUID Generator', desc: 'Generate unique IDs', url: 'uuid-generator.html' },
            { name: 'URL Encoder', desc: 'Encode/decode URLs', url: 'url-encoder-decoder.html' },
            { name: 'Regex Tester', desc: 'Test regular expressions', url: 'regex-tester.html' },
            { name: 'CSS Minifier', desc: 'Compress CSS code', url: 'css-minifier.html' },
            { name: 'JS Minifier', desc: 'Compress JavaScript', url: 'javascript-minifier.html' },
            { name: 'HTML Encoder', desc: 'Encode HTML entities', url: 'html-encoder.html' },
            { name: 'Diff Checker', desc: 'Compare two texts', url: 'diff-checker.html' },
            { name: 'Markdown Preview', desc: 'Live markdown renderer', url: 'markdown-preview.html' },
            { name: 'JSON to CSV', desc: 'Convert JSON to CSV', url: 'json-to-csv.html' },
        ]
    },
    {
        name: '✏️ Text & Writing',
        id: 'text',
        tools: [
            { name: 'Word Counter', desc: 'Words, characters, read time', url: 'calc/word-counter.html' },
            { name: 'Password Generator', desc: 'Strong secure passwords', url: 'calc/password-generator.html' },
            { name: 'Lorem Ipsum', desc: 'Generate placeholder text', url: 'lorem-ipsum-generator.html' },
            { name: 'QR Code Generator', desc: 'Create QR codes', url: 'qr-code-generator.html' },
        ]
    },
    {
        name: '🎲 Fun & Viral',
        id: 'fun',
        tools: [
            { name: 'Love Calculator', desc: 'Name compatibility test 💕', url: 'calc/love-calculator.html' },
            { name: 'Name Generator', desc: 'Random names for anything', url: 'calc/name-generator.html' },
            { name: 'Random Number', desc: 'RNG, dice, coin flip', url: 'calc/random-number-generator.html' },
        ]
    },
];

const totalTools = categories.reduce((s, c) => s + c.tools.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ToolPulse — ${totalTools}+ Free Online Tools & Calculators</title>
<meta name="description" content="Free online calculators, converters, and developer tools. ${totalTools}+ tools including mortgage calculator, BMI calculator, currency converter, JSON formatter, and more. No signup required.">
<meta name="keywords" content="free online tools, online calculator, unit converter, currency converter, developer tools, BMI calculator, mortgage calculator">
<link rel="canonical" href="${BASE}/">
<meta property="og:title" content="ToolPulse — ${totalTools}+ Free Online Tools">
<meta property="og:description" content="Free calculators, converters, and tools. No signup, works in your browser.">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD}" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"ToolPulse","url":"${BASE}/","description":"${totalTools}+ free online tools and calculators","potentialAction":{"@type":"SearchAction","target":"${BASE}/?q={search_term_string}","query-input":"required name=search_term_string"}}</script>
<style>
:root{--bg:#0a0e1a;--s:#111827;--s2:#1f2937;--b:#374151;--t:#f3f4f6;--m:#9ca3af;--a:#6366f1;--a2:#4f46e5;--g:rgba(99,102,241,.08)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--t);line-height:1.6}
header{background:var(--s);border-bottom:1px solid var(--b);padding:1rem 1.5rem;position:sticky;top:0;z-index:100;backdrop-filter:blur(10px)}
.hi{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:1rem}
.logo{font-size:1.4rem;font-weight:800;color:var(--a);text-decoration:none}
.tag{color:var(--m);font-size:.85rem;flex:1}
.search-box{padding:.5rem 1rem;background:var(--s2);border:1px solid var(--b);border-radius:8px;color:var(--t);font-size:.9rem;width:280px;outline:none}
.search-box:focus{border-color:var(--a)}
.hero{text-align:center;padding:3rem 1.5rem 2rem;max-width:800px;margin:0 auto}
.hero h1{font-size:2.5rem;font-weight:900;margin-bottom:.5rem;background:linear-gradient(135deg,#f3f4f6,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:var(--m);font-size:1.1rem}
.hero .count{display:inline-block;background:var(--a);color:#fff;padding:.2rem .8rem;border-radius:20px;font-size:.85rem;font-weight:700;margin-top:.5rem}
.ad{max-width:1100px;margin:1rem auto;padding:0 1.5rem}
main{max-width:1100px;margin:0 auto;padding:0 1.5rem 3rem}
.cat{margin-bottom:2.5rem}
.cat h2{font-size:1.3rem;font-weight:700;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid var(--b)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem}
.card{background:var(--s);border:1px solid var(--b);border-radius:10px;padding:1rem 1.25rem;text-decoration:none;color:var(--t);transition:all .2s}
.card:hover{border-color:var(--a);transform:translateY(-2px);background:var(--g)}
.card h3{font-size:.95rem;font-weight:600;margin-bottom:.25rem}
.card p{font-size:.8rem;color:var(--m);line-height:1.4}
.more-link{display:inline-block;margin-top:.75rem;color:var(--a);text-decoration:none;font-size:.85rem;font-weight:600}
.more-link:hover{text-decoration:underline}
.banner{background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:12px;padding:2rem;text-align:center;margin:2rem 0}
.banner h3{color:#fff;font-size:1.3rem;margin-bottom:.5rem}
.banner p{color:rgba(255,255,255,.8);margin-bottom:1rem;font-size:.9rem}
.banner a{display:inline-block;background:#fff;color:#4f46e5;font-weight:700;padding:.6rem 1.5rem;border-radius:8px;text-decoration:none}
footer{text-align:center;padding:2rem 1.5rem;color:var(--m);font-size:.8rem;border-top:1px solid var(--b)}
footer a{color:var(--a);text-decoration:none;margin:0 .5rem}
@media(max-width:600px){.hero h1{font-size:1.8rem}.search-box{width:150px}.grid{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<header><div class="hi">
<a href="index.html" class="logo">🔧 ToolPulse</a>
<span class="tag">${totalTools}+ Free Tools</span>
<input type="text" class="search-box" id="search" placeholder="Search tools..." oninput="filterTools()">
</div></header>

<div class="hero">
<h1>Free Online Tools & Calculators</h1>
<p>Financial calculators, unit converters, developer tools, and more — all free, no signup, works in your browser.</p>
<span class="count">${totalTools}+ tools available</span>
</div>

<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<main>
${categories.map(cat => `
<div class="cat" id="${cat.id}">
<h2>${cat.name}</h2>
<div class="grid">
${cat.tools.map(t => `<a class="card tool-card" href="${t.url}" data-name="${t.name.toLowerCase()} ${(t.desc||'').toLowerCase()}"><h3>${t.name}</h3><p>${t.desc || ''}</p></a>`).join('\n')}
</div>
${cat.id === 'currency' ? '<a class="more-link" href="convert-usd-to-eur.html">View all 240+ currency conversions →</a>' : ''}
</div>
`).join('\n')}

<div class="banner">
<h3>💰 Need Financial Calculators?</h3>
<p>18 specialized finance calculators — mortgage, insurance, tax, retirement, and more</p>
<a href="https://alexchalu.github.io/smartcalc/">Visit SmartCalc →</a>
</div>

<div class="cat">
<h2>📝 Guides & Articles</h2>
<div class="grid">
<a class="card" href="blog/how-to-create-a-budget.html"><h3>How to Create a Budget</h3><p>Complete step-by-step guide</p></a>
<a class="card" href="blog/how-to-calculate-bmi.html"><h3>How to Calculate BMI</h3><p>Formula, chart, and what it means</p></a>
<a class="card" href="blog/how-much-house-can-i-afford.html"><h3>How Much House Can I Afford?</h3><p>Home affordability guide 2026</p></a>
<a class="card" href="blog/how-to-save-money.html"><h3>35 Money-Saving Tips</h3><p>Save $500-$2000+/month</p></a>
<a class="card" href="blog/best-free-online-calculators.html"><h3>Best Free Calculators</h3><p>Curated list of top tools</p></a>
</div>
</div>
</main>

<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<footer>
<p>ToolPulse — All tools run in your browser. 100% free, 100% private.</p>
<p><a href="index.html">Home</a><a href="blog/">Blog</a><a href="https://alexchalu.github.io/smartcalc/">SmartCalc</a><a href="https://alexchalu.github.io/focustab/">FocusTab</a></p>
<p style="margin-top:.5rem">© 2026 ToolPulse. All calculations are for informational purposes only.</p>
</footer>

<script>
function filterTools() {
    const q = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.tool-card').forEach(card => {
        const match = card.dataset.name.includes(q);
        card.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('.cat').forEach(cat => {
        const visible = cat.querySelectorAll('.tool-card:not([style*="display: none"])').length;
        cat.style.display = (visible > 0 || !q) ? '' : 'none';
    });
}
</script>
</body>
</html>`;

fs.writeFileSync(__dirname + '/index.html', html);
console.log(`✅ Homepage rebuilt with ${totalTools} tools across ${categories.length} categories`);
console.log('Categories:', categories.map(c => `${c.name} (${c.tools.length})`).join(', '));
