const fs = require('fs');

const adsenseId = 'ca-pub-3112605892426625';

const cityPairs = [
  { from: 'New York', to: 'Austin', fromCOL: 187, toCOL: 110, fromTax: 8.82, toTax: 0 },
  { from: 'San Francisco', to: 'Austin', fromCOL: 176, toCOL: 110, fromTax: 9.3, toTax: 0 },
  { from: 'New York', to: 'Miami', fromCOL: 187, toCOL: 125, fromTax: 8.82, toTax: 0 },
  { from: 'Los Angeles', to: 'Dallas', fromCOL: 146, toCOL: 95, fromTax: 9.3, toTax: 0 },
  { from: 'Seattle', to: 'Denver', fromCOL: 138, toCOL: 115, fromTax: 0, toTax: 4.5 },
  { from: 'Boston', to: 'Charlotte', fromCOL: 152, toCOL: 98, fromTax: 5.0, toTax: 4.75 },
  { from: 'Chicago', to: 'Phoenix', fromCOL: 118, toCOL: 105, fromTax: 4.95, toTax: 2.5 },
  { from: 'Washington DC', to: 'Atlanta', fromCOL: 155, toCOL: 108, fromTax: 8.95, toTax: 5.75 }
];

cityPairs.forEach(pair => {
  const slug = `${pair.from.toLowerCase().replace(/ /g, '-')}-vs-${pair.to.toLowerCase().replace(/ /g, '-')}-salary`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pair.from} vs ${pair.to} Salary Calculator - Cost of Living Comparison 2026</title>
    <meta name="description" content="Compare ${pair.from} and ${pair.to} salaries adjusted for cost of living. Free calculator shows equivalent salary when moving between cities.">
    <meta name="keywords" content="${pair.from} vs ${pair.to}, salary comparison ${pair.from} ${pair.to}, cost of living ${pair.from} ${pair.to}, relocate ${pair.from} to ${pair.to}">
    <link rel="stylesheet" href="/style.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}" crossorigin="anonymous"></script>
    <style>
      .comparison-container { max-width: 900px; margin: 2rem auto; padding: 0 2rem; }
      .calc-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 2rem 0; }
      .city-comparison { display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: center; margin: 2rem 0; }
      .city-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center; }
      .city-card h3 { margin: 0 0 1rem; font-size: 1.5rem; }
      .city-card .col-index { font-size: 2.5rem; font-weight: bold; margin: 1rem 0; }
      .city-card .label { font-size: 0.9rem; opacity: 0.9; }
      .vs-badge { background: #3498db; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; }
      .input-group { margin: 1.5rem 0; }
      .input-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #34495e; }
      .input-group input { width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1.1rem; }
      .calc-button { background: #3498db; color: white; border: none; padding: 1rem 2rem; border-radius: 6px; font-size: 1.1rem; font-weight: 600; cursor: pointer; width: 100%; margin-top: 1rem; }
      .calc-button:hover { background: #2980b9; }
      .result-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 2rem; margin: 2rem 0; border-radius: 6px; }
      .result-value { font-size: 2.5rem; font-weight: bold; color: #1b5e20; margin: 1rem 0; }
      .comparison-table { width: 100%; margin: 2rem 0; border-collapse: collapse; }
      .comparison-table th, .comparison-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
      .comparison-table th { background: #f8f9fa; font-weight: 600; }
      .ad-container { margin: 2rem 0; text-align: center; min-height: 90px; }
      .highlight { background: #fff3e0; padding: 1.5rem; border-radius: 8px; margin: 2rem 0; }
    </style>
</head>
<body>
    <div class="comparison-container">
        <h1>💰 ${pair.from} vs ${pair.to} Salary Calculator</h1>
        <p>Compare salaries between ${pair.from} and ${pair.to} adjusted for cost of living. Find out what you need to earn in ${pair.to} to maintain the same lifestyle.</p>



        <div class="city-comparison">
            <div class="city-card">
                <h3>${pair.from}</h3>
                <div class="col-index">${pair.fromCOL}</div>
                <div class="label">Cost of Living Index</div>
                <div style="margin-top: 1rem; font-size: 0.9rem;">State Tax: ${pair.fromTax}%</div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="city-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <h3>${pair.to}</h3>
                <div class="col-index">${pair.toCOL}</div>
                <div class="label">Cost of Living Index</div>
                <div style="margin-top: 1rem; font-size: 0.9rem;">State Tax: ${pair.toTax}%</div>
            </div>
        </div>

        <div class="calc-card">
            <h2>Calculate Equivalent Salary</h2>
            
            <div class="input-group">
                <label>Current Salary in ${pair.from} ($)</label>
                <input type="number" id="salary" value="100000" min="0" step="1000" placeholder="Enter your ${pair.from} salary">
            </div>

            <button class="calc-button" onclick="calculate()">Calculate ${pair.to} Equivalent</button>

            <div id="results" style="display:none;">
                <div class="result-box">
                    <h3>Equivalent Salary in ${pair.to}</h3>
                    <div class="result-value" id="equivalentSalary"></div>
                    <p id="difference"></p>
                    <p style="font-size: 0.95rem; color: #666; margin-top: 1rem;">This accounts for cost of living differences and state income tax rates.</p>
                </div>

                <table class="comparison-table">
                    <tr>
                        <th></th>
                        <th>${pair.from}</th>
                        <th>${pair.to}</th>
                    </tr>
                    <tr>
                        <td><strong>Gross Salary</strong></td>
                        <td id="fromGross"></td>
                        <td id="toGross"></td>
                    </tr>
                    <tr>
                        <td><strong>After State Tax</strong></td>
                        <td id="fromAfterTax"></td>
                        <td id="toAfterTax"></td>
                    </tr>
                    <tr>
                        <td><strong>Cost of Living Index</strong></td>
                        <td>${pair.fromCOL}</td>
                        <td>${pair.toCOL}</td>
                    </tr>
                    <tr>
                        <td><strong>Purchasing Power</strong></td>
                        <td id="fromPurchasing"></td>
                        <td id="toPurchasing"></td>
                    </tr>
                </table>
            </div>
        </div>



        <div class="highlight">
            <h3>📊 ${pair.from} vs ${pair.to}: Key Differences</h3>
            <p><strong>Cost of Living:</strong> ${pair.fromCOL > pair.toCOL ? 
              pair.from + ' is ' + Math.round((pair.fromCOL / pair.toCOL - 1) * 100) + '% more expensive than ' + pair.to :
              pair.to + ' is ' + Math.round((pair.toCOL / pair.fromCOL - 1) * 100) + '% more expensive than ' + pair.from}.</p>
            <p><strong>State Income Tax:</strong> ${pair.from} (${pair.fromTax}%) vs ${pair.to} (${pair.toTax}%).</p>
            <p><strong>Bottom line:</strong> A $100,000 salary in ${pair.from} is equivalent to approximately $${Math.round(100000 * (pair.toCOL / pair.fromCOL)).toLocaleString()} in ${pair.to} for the same lifestyle.</p>
        </div>

        <h2>Should You Move from ${pair.from} to ${pair.to}?</h2>
        <p>Consider these factors:</p>
        <ul>
            <li><strong>Housing costs:</strong> ${pair.fromCOL > pair.toCOL ? pair.to + ' typically has 30-50% lower rent/mortgage' : pair.from + ' housing may be more affordable in some neighborhoods'}</li>
            <li><strong>State taxes:</strong> ${pair.toTax === 0 ? pair.to + ' has no state income tax (save ' + pair.fromTax + '%)' : 'Both cities have state income tax'}</li>
            <li><strong>Job market:</strong> Research industry-specific salaries and opportunities</li>
            <li><strong>Quality of life:</strong> Weather, culture, schools, commute times</li>
        </ul>



        <h2>Related Salary Calculators</h2>
        <ul>
            <li><a href="/calc/salary.html">Salary Calculator</a></li>
            <li><a href="/col/${pair.from.toLowerCase().replace(/ /g, '-')}.html">${pair.from} Cost of Living</a></li>
            <li><a href="/">All Calculators</a></li>
        </ul>

        <p><a href="/">← Back to CalcLeap</a></p>
    </div>

    <script>
    function calculate() {
        const salary = parseFloat(document.getElementById('salary').value);
        
        // Adjust for state tax
        const fromAfterTax = salary * (1 - ${pair.fromTax} / 100);
        
        // Adjust for cost of living
        const equivalentGross = salary * (${pair.toCOL} / ${pair.fromCOL});
        const toAfterTax = equivalentGross * (1 - ${pair.toTax} / 100);
        
        // Purchasing power (after-tax income adjusted for COL)
        const fromPurchasing = fromAfterTax / ${pair.fromCOL} * 100;
        const toPurchasing = toAfterTax / ${pair.toCOL} * 100;
        
        const difference = equivalentGross - salary;
        const percentDiff = ((equivalentGross / salary - 1) * 100).toFixed(1);
        
        document.getElementById('equivalentSalary').textContent = '$' + Math.round(equivalentGross).toLocaleString();
        document.getElementById('difference').innerHTML = difference > 0 ? 
            '<strong style="color: #e74c3c;">You would need $' + Math.round(Math.abs(difference)).toLocaleString() + ' MORE (' + percentDiff + '%) in ${pair.to}</strong>' :
            '<strong style="color: #27ae60;">You would need $' + Math.round(Math.abs(difference)).toLocaleString() + ' LESS (' + Math.abs(percentDiff) + '% savings) in ${pair.to}</strong>';
        
        document.getElementById('fromGross').textContent = '$' + Math.round(salary).toLocaleString();
        document.getElementById('toGross').textContent = '$' + Math.round(equivalentGross).toLocaleString();
        document.getElementById('fromAfterTax').textContent = '$' + Math.round(fromAfterTax).toLocaleString();
        document.getElementById('toAfterTax').textContent = '$' + Math.round(toAfterTax).toLocaleString();
        document.getElementById('fromPurchasing').textContent = Math.round(fromPurchasing).toLocaleString() + ' pts';
        document.getElementById('toPurchasing').textContent = Math.round(toPurchasing).toLocaleString() + ' pts';
        
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
    </script>
</body>
</html>`;

  fs.mkdirSync('compare', { recursive: true });
  fs.writeFileSync(`compare/${slug}.html`, html);
  console.log(`✓ Created compare/${slug}.html`);
});

console.log(`\n✅ Generated ${cityPairs.length} salary comparison pages`);
