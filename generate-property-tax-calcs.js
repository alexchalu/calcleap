#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All 50 states with property tax rates (effective rates as % of home value)
const states = [
  { name: 'Alabama', abbr: 'AL', rate: 0.41 },
  { name: 'Alaska', abbr: 'AK', rate: 1.19 },
  { name: 'Arizona', abbr: 'AZ', rate: 0.62 },
  { name: 'Arkansas', abbr: 'AR', rate: 0.62 },
  { name: 'California', abbr: 'CA', rate: 0.76 },
  { name: 'Colorado', abbr: 'CO', rate: 0.51 },
  { name: 'Connecticut', abbr: 'CT', rate: 2.14 },
  { name: 'Delaware', abbr: 'DE', rate: 0.57 },
  { name: 'Florida', abbr: 'FL', rate: 0.98 },
  { name: 'Georgia', abbr: 'GA', rate: 0.92 },
  { name: 'Hawaii', abbr: 'HI', rate: 0.28 },
  { name: 'Idaho', abbr: 'ID', rate: 0.69 },
  { name: 'Illinois', abbr: 'IL', rate: 2.27 },
  { name: 'Indiana', abbr: 'IN', rate: 0.85 },
  { name: 'Iowa', abbr: 'IA', rate: 1.57 },
  { name: 'Kansas', abbr: 'KS', rate: 1.41 },
  { name: 'Kentucky', abbr: 'KY', rate: 0.86 },
  { name: 'Louisiana', abbr: 'LA', rate: 0.55 },
  { name: 'Maine', abbr: 'ME', rate: 1.36 },
  { name: 'Maryland', abbr: 'MD', rate: 1.09 },
  { name: 'Massachusetts', abbr: 'MA', rate: 1.23 },
  { name: 'Michigan', abbr: 'MI', rate: 1.54 },
  { name: 'Minnesota', abbr: 'MN', rate: 1.12 },
  { name: 'Mississippi', abbr: 'MS', rate: 0.79 },
  { name: 'Missouri', abbr: 'MO', rate: 0.97 },
  { name: 'Montana', abbr: 'MT', rate: 0.84 },
  { name: 'Nebraska', abbr: 'NE', rate: 1.73 },
  { name: 'Nevada', abbr: 'NV', rate: 0.69 },
  { name: 'New Hampshire', abbr: 'NH', rate: 2.18 },
  { name: 'New Jersey', abbr: 'NJ', rate: 2.49 },
  { name: 'New Mexico', abbr: 'NM', rate: 0.80 },
  { name: 'New York', abbr: 'NY', rate: 1.72 },
  { name: 'North Carolina', abbr: 'NC', rate: 0.84 },
  { name: 'North Dakota', abbr: 'ND', rate: 0.98 },
  { name: 'Ohio', abbr: 'OH', rate: 1.56 },
  { name: 'Oklahoma', abbr: 'OK', rate: 0.90 },
  { name: 'Oregon', abbr: 'OR', rate: 0.97 },
  { name: 'Pennsylvania', abbr: 'PA', rate: 1.58 },
  { name: 'Rhode Island', abbr: 'RI', rate: 1.63 },
  { name: 'South Carolina', abbr: 'SC', rate: 0.57 },
  { name: 'South Dakota', abbr: 'SD', rate: 1.31 },
  { name: 'Tennessee', abbr: 'TN', rate: 0.71 },
  { name: 'Texas', abbr: 'TX', rate: 1.80 },
  { name: 'Utah', abbr: 'UT', rate: 0.60 },
  { name: 'Vermont', abbr: 'VT', rate: 1.90 },
  { name: 'Virginia', abbr: 'VA', rate: 0.82 },
  { name: 'Washington', abbr: 'WA', rate: 0.98 },
  { name: 'West Virginia', abbr: 'WV', rate: 0.58 },
  { name: 'Wisconsin', abbr: 'WI', rate: 1.85 },
  { name: 'Wyoming', abbr: 'WY', rate: 0.61 },
];

function generateHTML(state) {
  const slug = `${state.name.toLowerCase().replace(/ /g, '-')}-property-tax-calculator`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.name} Property Tax Calculator - Free ${state.abbr} Real Estate Tax Tool | ToolPulse</title>
    <meta name="description" content="Calculate ${state.name} property tax based on home value. Free ${state.abbr} property tax calculator with effective tax rates.">
    <link rel="canonical" href="https://alexchalu.github.io/toolpulse/${slug}.html">
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
        .stat-box { background: #f0f4ff; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 1.5rem; }
        .stat-box h3 { font-size: 0.9rem; color: #666; margin-bottom: 0.5rem; }
        .stat-box .value { font-size: 2rem; font-weight: 700; color: #667eea; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input { width: 100%; padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; transition: border 0.3s; }
        .input-group input:focus { outline: none; border-color: #667eea; }
        .calc-btn { background: #667eea; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; border-radius: 8px; cursor: pointer; width: 100%; transition: background 0.3s; }
        .calc-btn:hover { background: #5568d3; }
        .result-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 1.5rem; border-radius: 6px; margin-top: 1.5rem; display: none; }
        .result-box h3 { color: #667eea; margin-bottom: 1rem; }
        .result-value { font-size: 1.8rem; font-weight: 700; color: #667eea; margin: 0.5rem 0; }
        .result-detail { margin: 0.5rem 0; color: #555; }
        .info-section { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .info-section h3 { color: #667eea; margin-bottom: 1rem; }
        .info-section p { margin-bottom: 1rem; }
        .ad-placeholder { background: #f0f0f0; border: 2px dashed #ccc; padding: 2rem; text-align: center; margin: 2rem 0; border-radius: 8px; min-height: 250px; display: flex; align-items: center; justify-content: center; }
        .footer { background: #2d3748; color: white; padding: 2rem 0; text-align: center; }
        .footer a { color: #667eea; text-decoration: none; }
        @media (max-width: 768px) { .header h1 { font-size: 1.5rem; } }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${state.name} Property Tax Calculator</h1>
            <p>Calculate property taxes based on ${state.name} real estate values</p>
        </div>
    </div>

    <div class="main container">
        <div class="calc-box">
            <div class="stat-box">
                <h3>${state.name} Effective Property Tax Rate</h3>
                <div class="value">${state.rate}%</div>
                <small>Average rate of assessed home value</small>
            </div>
        </div>

        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calc-box">
            <h2>Calculate Your ${state.name} Property Tax</h2>
            <div class="input-group">
                <label for="home-value">Home Value ($):</label>
                <input type="number" id="home-value" min="0" value="300000">
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Property Tax</button>
            <div class="result-box" id="result">
                <h3>Estimated Property Tax</h3>
            </div>
        </div>

        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-section">
            <h3>About ${state.name} Property Taxes</h3>
            <p>The effective property tax rate in ${state.name} is ${state.rate}% of the home's assessed value. This means for every $100,000 in home value, you'll pay approximately $${(state.rate * 1000).toFixed(0)} in annual property taxes.</p>
            <p>${state.name} ranks ${state.rate > 1.5 ? 'among the higher property tax states' : state.rate < 0.7 ? 'among the lower property tax states' : 'in the middle range'} for property tax rates in the United States.</p>
            <h3>More ${state.name} Tools</h3>
            <ul>
                <li><a href="index.html">ToolPulse Home - All Tools</a></li>
                <li><a href="${state.name.toLowerCase().replace(/ /g, '-')}-income-tax-calculator.html">${state.name} Income Tax Calculator</a></li>
                <li><a href="https://alexchalu.github.io/smartcalc/">SmartCalc - Financial Calculators</a></li>
            </ul>
        </div>

        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 ToolPulse. Free online tools and calculators.</p>
            <p><a href="index.html">Home</a></p>
        </div>
    </div>

    <script>
        function calculate() {
            const homeValue = parseFloat(document.getElementById('home-value').value);
            const taxRate = ${state.rate} / 100;
            
            const annualTax = homeValue * taxRate;
            const monthlyTax = annualTax / 12;
            
            let html = '<h3>Estimated ${state.name} Property Tax</h3>';
            html += '<div class="result-value">$' + annualTax.toFixed(0).toLocaleString() + '/year</div>';
            html += '<div class="result-detail">Monthly: $' + monthlyTax.toFixed(2).toLocaleString() + '</div>';
            html += '<div class="result-detail">Home Value: $' + homeValue.toLocaleString() + '</div>';
            html += '<div class="result-detail">Effective Rate: ${state.rate}%</div>';
            html += '<div class="result-detail" style="margin-top: 1rem; font-size: 0.9rem; color: #666;">Note: Actual property taxes may vary by county and municipality. This calculator uses the state average effective rate.</div>';
            
            document.getElementById('result').innerHTML = html;
            document.getElementById('result').style.display = 'block';
        }
    </script>
</body>
</html>`;
}

let count = 0;
states.forEach(state => {
  const html = generateHTML(state);
  const slug = `${state.name.toLowerCase().replace(/ /g, '-')}-property-tax-calculator`;
  fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
  count++;
  console.log(`✓ Generated ${slug}.html`);
});

console.log(`\n✅ Generated ${count} property tax calculators (ALL 50 STATES)`);
console.log('📝 High search volume: "[state] property tax calculator"');
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
