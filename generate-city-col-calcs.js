#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Top 30 US cities by population + cost of living interest
const cities = [
  { name: 'New York', state: 'NY', col: 187, rent: 3500, avgIncome: 85000 },
  { name: 'Los Angeles', state: 'CA', col: 173, rent: 2800, avgIncome: 75000 },
  { name: 'Chicago', state: 'IL', col: 106, rent: 1800, avgIncome: 65000 },
  { name: 'Houston', state: 'TX', col: 94, rent: 1500, avgIncome: 60000 },
  { name: 'Phoenix', state: 'AZ', col: 97, rent: 1600, avgIncome: 58000 },
  { name: 'Philadelphia', state: 'PA', col: 102, rent: 1700, avgIncome: 62000 },
  { name: 'San Antonio', state: 'TX', col: 89, rent: 1300, avgIncome: 55000 },
  { name: 'San Diego', state: 'CA', col: 160, rent: 2600, avgIncome: 78000 },
  { name: 'Dallas', state: 'TX', col: 99, rent: 1700, avgIncome: 68000 },
  { name: 'San Jose', state: 'CA', col: 176, rent: 3200, avgIncome: 110000 },
  { name: 'Austin', state: 'TX', col: 119, rent: 2000, avgIncome: 75000 },
  { name: 'Jacksonville', state: 'FL', col: 93, rent: 1400, avgIncome: 56000 },
  { name: 'Fort Worth', state: 'TX', col: 95, rent: 1500, avgIncome: 62000 },
  { name: 'Columbus', state: 'OH', col: 90, rent: 1300, avgIncome: 58000 },
  { name: 'Charlotte', state: 'NC', col: 97, rent: 1600, avgIncome: 64000 },
  { name: 'San Francisco', state: 'CA', col: 244, rent: 3800, avgIncome: 120000 },
  { name: 'Indianapolis', state: 'IN', col: 88, rent: 1200, avgIncome: 55000 },
  { name: 'Seattle', state: 'WA', col: 172, rent: 2500, avgIncome: 95000 },
  { name: 'Denver', state: 'CO', col: 140, rent: 2200, avgIncome: 75000 },
  { name: 'Boston', state: 'MA', col: 162, rent: 2700, avgIncome: 85000 },
  { name: 'Nashville', state: 'TN', col: 104, rent: 1800, avgIncome: 62000 },
  { name: 'Portland', state: 'OR', col: 146, rent: 2100, avgIncome: 70000 },
  { name: 'Las Vegas', state: 'NV', col: 107, rent: 1600, avgIncome: 56000 },
  { name: 'Detroit', state: 'MI', col: 85, rent: 1100, avgIncome: 52000 },
  { name: 'Memphis', state: 'TN', col: 83, rent: 1100, avgIncome: 50000 },
  { name: 'Baltimore', state: 'MD', col: 107, rent: 1700, avgIncome: 60000 },
  { name: 'Milwaukee', state: 'WI', col: 90, rent: 1300, avgIncome: 54000 },
  { name: 'Albuquerque', state: 'NM', col: 92, rent: 1200, avgIncome: 52000 },
  { name: 'Tucson', state: 'AZ', col: 89, rent: 1100, avgIncome: 50000 },
  { name: 'Miami', state: 'FL', col: 123, rent: 2300, avgIncome: 65000 },
];

function generateHTML(city) {
  const slug = `${city.name.toLowerCase().replace(/ /g, '-')}-cost-of-living-calculator`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${city.name}, ${city.state} Cost of Living Calculator | Compare Salary & Expenses | CalcLeap</title>
    <meta name="description" content="Calculate cost of living in ${city.name}, ${city.state}. Compare rent, salary, and expenses. Free ${city.name} COL calculator with salary comparison.">
    <link rel="canonical" href="https://calcleap.com/${slug}.html">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .main { padding: 2rem 0; }
        .calc-box { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .calc-box h2 { margin-bottom: 1.5rem; color: #667eea; }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #f0f4ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea; }
        .stat-card h3 { font-size: 0.9rem; color: #666; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 1.5rem; font-weight: 700; color: #667eea; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; transition: border 0.3s; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #667eea; }
        .calc-btn { background: #667eea; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; border-radius: 8px; cursor: pointer; width: 100%; transition: background 0.3s; }
        .calc-btn:hover { background: #5568d3; }
        .result-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 1.5rem; border-radius: 6px; margin-top: 1.5rem; display: none; }
        .result-box h3 { color: #667eea; margin-bottom: 1rem; }
        .result-value { font-size: 1.6rem; font-weight: 700; color: #667eea; margin: 0.5rem 0; }
        .result-detail { margin: 0.5rem 0; color: #555; }
        .info-section { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .info-section h3 { color: #667eea; margin-bottom: 1rem; }
        .info-section p { margin-bottom: 1rem; }
        .ad-placeholder { background: #f0f0f0; border: 2px dashed #ccc; padding: 2rem; text-align: center; margin: 2rem 0; border-radius: 8px; min-height: 250px; display: flex; align-items: center; justify-content: center; }
        .footer { background: #2d3748; color: white; padding: 2rem 0; text-align: center; }
        .footer a { color: #667eea; text-decoration: none; }
        @media (max-width: 768px) { .header h1 { font-size: 1.5rem; } .stat-grid { grid-template-columns: 1fr; } }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${city.name}, ${city.state} Cost of Living Calculator</h1>
            <p>Compare salary and living expenses in ${city.name}</p>
        </div>
    </div>

    <div class="main container">
        <div class="calc-box">
            <h2>${city.name} Quick Stats</h2>
            <div class="stat-grid">
                <div class="stat-card">
                    <h3>Cost of Living Index</h3>
                    <div class="value">${city.col}</div>
                    <small>US Average = 100</small>
                </div>
                <div class="stat-card">
                    <h3>Average Rent</h3>
                    <div class="value">$${city.rent.toLocaleString()}/mo</div>
                    <small>1-bedroom apartment</small>
                </div>
                <div class="stat-card">
                    <h3>Median Income</h3>
                    <div class="value">$${city.avgIncome.toLocaleString()}</div>
                    <small>Per year</small>
                </div>
            </div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="calc-box">
            <h2>Compare Your Salary</h2>
            <div class="input-group">
                <label for="current-city">Your Current City:</label>
                <input type="text" id="current-city" value="National Average" placeholder="e.g. Seattle, WA">
            </div>
            <div class="input-group">
                <label for="current-salary">Your Current Salary ($):</label>
                <input type="number" id="current-salary" min="0" value="60000">
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Equivalent Salary in ${city.name}</button>
            <div class="result-box" id="result">
                <h3>Results</h3>
            </div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About Living in ${city.name}, ${city.state}</h3>
            <p>The cost of living in ${city.name} is ${city.col > 100 ? (city.col - 100) + '% higher' : (100 - city.col) + '% lower'} than the US national average.</p>
            <p><strong>Key expenses in ${city.name}:</strong></p>
            <ul>
                <li>Housing: ${city.col > 120 ? 'Significantly above average' : city.col > 100 ? 'Above average' : 'Below average'}</li>
                <li>Average 1-bedroom rent: $${city.rent.toLocaleString()}/month</li>
                <li>Median household income: $${city.avgIncome.toLocaleString()}/year</li>
            </ul>
            <h3>More Tools</h3>
            <ul>
                <li><a href="index.html">CalcLeap Home - All Tools</a></li>
                <li><a href="https://calcleap.com/">SmartCalc - Financial Calculators</a></li>
                <li><a href="${city.state.toLowerCase()}-income-tax-calculator.html">${city.state} Income Tax Calculator</a></li>
            </ul>
        </div>

        <div class="ad-placeholder">


        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 CalcLeap. Free online tools and calculators.</p>
            <p><a href="index.html">Home</a></p>
        </div>
    </div>

    <script>
        function calculate() {
            const currentSalary = parseFloat(document.getElementById('current-salary').value);
            const targetCOL = ${city.col};
            
            // Adjust salary based on cost of living
            const equivalentSalary = currentSalary * (targetCOL / 100);
            const difference = equivalentSalary - currentSalary;
            const percentChange = ((equivalentSalary - currentSalary) / currentSalary) * 100;
            
            let html = '<h3>Equivalent Salary in ${city.name}</h3>';
            html += '<div class="result-value">$' + equivalentSalary.toFixed(0).toLocaleString() + '/year</div>';
            html += '<div class="result-detail">Your Current Salary: $' + currentSalary.toLocaleString() + '</div>';
            html += '<div class="result-detail">Difference: $' + Math.abs(difference).toFixed(0).toLocaleString() + ' (' + Math.abs(percentChange).toFixed(1) + '% ' + (difference >= 0 ? 'higher' : 'lower') + ')</div>';
            html += '<div class="result-detail" style="margin-top: 1rem;">A salary of $' + equivalentSalary.toFixed(0).toLocaleString() + ' in ${city.name} would give you similar purchasing power to $' + currentSalary.toLocaleString() + ' in your current location.</div>';
            
            document.getElementById('result').innerHTML = html;
            document.getElementById('result').style.display = 'block';
        }
    </script>
</body>
</html>`;
}

let count = 0;
cities.forEach(city => {
  const html = generateHTML(city);
  const slug = `${city.name.toLowerCase().replace(/ /g, '-')}-cost-of-living-calculator`;
  fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
  count++;
  console.log(`✓ Generated ${slug}.html`);
});

console.log(`\n✅ Generated ${count} city cost-of-living calculators`);
console.log('📝 High search volume: "[city] cost of living calculator"');
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
