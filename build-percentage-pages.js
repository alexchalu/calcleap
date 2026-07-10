#!/usr/bin/env node
// Generate "what is X% of Y" pages — targets millions of daily searches
const fs = require('fs');
const path = require('path');

const percentages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30, 33, 35, 40, 45, 50, 60, 70, 75, 80, 90];
const amounts = [50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 750, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 75000, 100000];

const dir = path.join(__dirname, 'percent');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let count = 0;
const pages = [];

for (const pct of percentages) {
  for (const amt of amounts) {
    const result = (pct / 100 * amt);
    const resultStr = result % 1 === 0 ? result.toLocaleString() : result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amtStr = amt.toLocaleString();
    const slug = `what-is-${pct}-percent-of-${amt}`;
    const title = `What is ${pct}% of ${amtStr}?`;
    const desc = `${pct}% of ${amtStr} is ${resultStr}. Free calculator to find any percentage of any number instantly.`;

    // Generate related calculations
    const related = [];
    for (const p2 of [5, 10, 15, 20, 25, 30, 50, 75]) {
      if (p2 !== pct) {
        related.push({ pct: p2, amt, result: (p2 / 100 * amt) });
      }
    }
    for (const a2 of [100, 500, 1000, 5000, 10000, 50000]) {
      if (a2 !== amt) {
        related.push({ pct, amt: a2, result: (pct / 100 * a2) });
      }
    }

    const relatedLinks = related.slice(0, 12).map(r => {
      const rRes = r.result % 1 === 0 ? r.result.toLocaleString() : r.result.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return `<a href="/toolpulse/percent/what-is-${r.pct}-percent-of-${r.amt}.html">${r.pct}% of ${r.amt.toLocaleString()} = ${rRes}</a>`;
    }).join('\n            ');

    // Percentage table for this amount
    const tableRows = [1,2,3,4,5,10,15,20,25,30,40,50,60,70,75,80,90,100].map(p => {
      const v = (p / 100 * amt);
      const vStr = v % 1 === 0 ? v.toLocaleString() : v.toLocaleString(undefined, { maximumFractionDigits: 2 });
      const highlight = p === pct ? ' style="background:#2563eb22;font-weight:bold"' : '';
      return `<tr${highlight}><td>${p}%</td><td>${vStr}</td></tr>`;
    }).join('\n                ');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} Answer & Calculator | CalcLeap</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="https://calcleap.com/percent/${slug}.html">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "${title}",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "${pct}% of ${amtStr} is ${resultStr}. To calculate ${pct}% of ${amtStr}, multiply ${amtStr} by ${pct/100} (or multiply by ${pct} and divide by 100)."
            }
        }, {
            "@type": "Question",
            "name": "How do you calculate ${pct} percent of a number?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "To find ${pct}% of any number, multiply the number by 0.${pct < 10 ? '0' + pct : pct}. For example, ${pct}% of ${amtStr} = ${amtStr} × 0.${pct < 10 ? '0' + pct : pct} = ${resultStr}."
            }
        }]
    }
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { font-size: 2rem; margin: 20px 0; color: #f8fafc; }
        .answer-box { background: #1e293b; border: 2px solid #2563eb; border-radius: 12px; padding: 30px; text-align: center; margin: 24px 0; }
        .answer-box .result { font-size: 3rem; font-weight: 800; color: #60a5fa; }
        .answer-box .formula { color: #94a3b8; margin-top: 8px; font-size: 1.1rem; }
        .calculator { background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .calculator h2 { font-size: 1.3rem; margin-bottom: 16px; }
        .calc-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
        .calc-row label { color: #94a3b8; }
        .calc-row input { background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 1.1rem; width: 120px; }
        .calc-result { font-size: 1.4rem; color: #60a5fa; font-weight: 700; margin-top: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #1e293b; }
        th { background: #1e293b; color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; }
        .related { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin: 16px 0; }
        .related a { display: block; padding: 10px 14px; background: #1e293b; border-radius: 8px; color: #60a5fa; text-decoration: none; font-size: 0.95rem; }
        .related a:hover { background: #2563eb22; }
        .section { margin: 32px 0; }
        .section h2 { font-size: 1.3rem; margin-bottom: 12px; color: #f8fafc; }
        .ad-slot { background: #1e293b; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; min-height: 90px; }
        .footer { text-align: center; padding: 32px 0; color: #64748b; font-size: 0.85rem; border-top: 1px solid #1e293b; margin-top: 40px; }
        .footer a { color: #60a5fa; text-decoration: none; }
        .breadcrumb { color: #64748b; font-size: 0.85rem; margin-bottom: 8px; }
        .breadcrumb a { color: #60a5fa; text-decoration: none; }
        .faq { margin: 24px 0; }
        .faq h3 { color: #f8fafc; margin: 16px 0 8px; }
        .faq p { color: #cbd5e1; }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container">
        <div class="breadcrumb">
            <a href="/toolpulse/">CalcLeap</a> › <a href="/toolpulse/percentage-calculator.html">Percentage Calculator</a> › ${pct}% of ${amtStr}
        </div>
        <h1>${title}</h1>
        <div class="answer-box">
            <div class="result">${resultStr}</div>
            <div class="formula">${amtStr} × ${pct/100} = ${resultStr}</div>
        </div>



        <div class="calculator">
            <h2>🔢 Custom Percentage Calculator</h2>
            <div class="calc-row">
                <label>What is</label>
                <input type="number" id="pctInput" value="${pct}">
                <label>% of</label>
                <input type="number" id="amtInput" value="${amt}">
                <label>?</label>
            </div>
            <div class="calc-result" id="calcResult">= ${resultStr}</div>
        </div>
        <script>
            const pi = document.getElementById('pctInput');
            const ai = document.getElementById('amtInput');
            const cr = document.getElementById('calcResult');
            function calc() { const r = (parseFloat(pi.value)||0)/100*(parseFloat(ai.value)||0); cr.textContent = '= ' + r.toLocaleString(undefined,{maximumFractionDigits:4}); }
            pi.addEventListener('input', calc);
            ai.addEventListener('input', calc);
        </script>

        <div class="section">
            <h2>How to Calculate ${pct}% of ${amtStr}</h2>
            <p>There are two easy methods:</p>
            <p><strong>Method 1 (Decimal):</strong> Convert ${pct}% to a decimal (${pct/100}), then multiply: ${amtStr} × ${pct/100} = <strong>${resultStr}</strong></p>
            <p><strong>Method 2 (Fraction):</strong> Multiply ${amtStr} by ${pct}, then divide by 100: (${amtStr} × ${pct}) / 100 = <strong>${resultStr}</strong></p>
        </div>

        <div class="section">
            <h2>Percentage Table for ${amtStr}</h2>
            <table>
                <thead><tr><th>Percent</th><th>Value</th></tr></thead>
                <tbody>
                ${tableRows}
                </tbody>
            </table>
        </div>



        <div class="section">
            <h2>Related Percentage Calculations</h2>
            <div class="related">
            ${relatedLinks}
            </div>
        </div>

        <div class="faq">
            <h2>Frequently Asked Questions</h2>
            <h3>${title}</h3>
            <p>${pct}% of ${amtStr} is <strong>${resultStr}</strong>. You can calculate this by multiplying ${amtStr} by ${pct/100}.</p>
            <h3>How do you calculate ${pct} percent of a number?</h3>
            <p>To find ${pct}% of any number, multiply the number by 0.${pct < 10 ? '0' + pct : pct}. For example, ${pct}% of ${amtStr} = ${amtStr} × 0.${pct < 10 ? '0' + pct : pct} = ${resultStr}.</p>
            <h3>What is the formula for percentage?</h3>
            <p>Percentage = (Part / Whole) × 100. To find X% of Y, use: Result = Y × (X / 100).</p>
        </div>



        <div class="footer">
            <a href="/toolpulse/">CalcLeap</a> · <a href="/toolpulse/percentage-calculator.html">Percentage Calculator</a> · <a href="https://calcleap.com/">SmartCalc Financial Tools</a>
            <br>© 2026 CalcLeap. Free online tools and calculators.
        </div>
    </div>
</body>
</html>`;

    const filePath = path.join(dir, `${slug}.html`);
    fs.writeFileSync(filePath, html);
    pages.push({ slug, title, pct, amt, result: resultStr });
    count++;
  }
}

console.log(`Generated ${count} percentage pages in /percent/`);

// Generate sitemap entries for these pages
const sitemapEntries = pages.map(p => 
  `  <url><loc>https://calcleap.com/percent/${p.slug}.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
).join('\n');
fs.writeFileSync(path.join(dir, 'sitemap-fragment.xml'), sitemapEntries);
console.log('Sitemap fragment saved.');

// Generate index page for percentage calculations
const indexLinks = pages.slice(0, 200).map(p => 
  `<a href="/toolpulse/percent/${p.slug}.html">${p.title} <span>${p.result}</span></a>`
).join('\n        ');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Percentage Calculator - What is X% of Y? | CalcLeap</title>
    <meta name="description" content="Calculate any percentage instantly. What is X% of Y? Browse hundreds of pre-calculated percentage answers or use our free calculator.">
    <link rel="canonical" href="https://calcleap.com/percent/">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        h1 { font-size: 2rem; margin: 20px 0; color: #f8fafc; text-align: center; }
        .subtitle { text-align: center; color: #94a3b8; margin-bottom: 32px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 6px; }
        .grid a { display: flex; justify-content: space-between; padding: 10px 14px; background: #1e293b; border-radius: 6px; color: #e2e8f0; text-decoration: none; font-size: 0.9rem; }
        .grid a:hover { background: #2563eb22; }
        .grid a span { color: #60a5fa; font-weight: 600; }
        .ad-slot { background: #1e293b; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; min-height: 90px; }
        .footer { text-align: center; padding: 32px 0; color: #64748b; font-size: 0.85rem; }
        .footer a { color: #60a5fa; text-decoration: none; }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container">
        <h1>📊 Percentage Calculator</h1>
        <p class="subtitle">What is X% of Y? Browse ${count} pre-calculated answers or use any page's calculator.</p>
        


        <div class="grid">
        ${indexLinks}
        </div>



        <div class="footer">
            <a href="/toolpulse/">← CalcLeap Home</a> · <a href="https://calcleap.com/">SmartCalc</a>
            <br>© 2026 CalcLeap
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
console.log('Index page created.');
