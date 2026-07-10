#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All 50 states with sales tax rates
const states = [
  { name: 'Alabama', abbr: 'AL', rate: 4.00, avgLocal: 5.22, avgCombined: 9.22 },
  { name: 'Alaska', abbr: 'AK', rate: 0, avgLocal: 1.76, avgCombined: 1.76 },
  { name: 'Arizona', abbr: 'AZ', rate: 5.60, avgLocal: 2.77, avgCombined: 8.37 },
  { name: 'Arkansas', abbr: 'AR', rate: 6.50, avgLocal: 2.93, avgCombined: 9.43 },
  { name: 'California', abbr: 'CA', rate: 7.25, avgLocal: 1.57, avgCombined: 8.82 },
  { name: 'Colorado', abbr: 'CO', rate: 2.90, avgLocal: 4.87, avgCombined: 7.77 },
  { name: 'Connecticut', abbr: 'CT', rate: 6.35, avgLocal: 0, avgCombined: 6.35 },
  { name: 'Delaware', abbr: 'DE', rate: 0, avgLocal: 0, avgCombined: 0 },
  { name: 'Florida', abbr: 'FL', rate: 6.00, avgLocal: 1.05, avgCombined: 7.05 },
  { name: 'Georgia', abbr: 'GA', rate: 4.00, avgLocal: 3.29, avgCombined: 7.29 },
  { name: 'Hawaii', abbr: 'HI', rate: 4.00, avgLocal: 0.44, avgCombined: 4.44 },
  { name: 'Idaho', abbr: 'ID', rate: 6.00, avgLocal: 0.03, avgCombined: 6.03 },
  { name: 'Illinois', abbr: 'IL', rate: 6.25, avgLocal: 2.52, avgCombined: 8.77 },
  { name: 'Indiana', abbr: 'IN', rate: 7.00, avgLocal: 0, avgCombined: 7.00 },
  { name: 'Iowa', abbr: 'IA', rate: 6.00, avgLocal: 0.94, avgCombined: 6.94 },
  { name: 'Kansas', abbr: 'KS', rate: 6.50, avgLocal: 2.17, avgCombined: 8.67 },
  { name: 'Kentucky', abbr: 'KY', rate: 6.00, avgLocal: 0, avgCombined: 6.00 },
  { name: 'Louisiana', abbr: 'LA', rate: 4.45, avgLocal: 5.07, avgCombined: 9.52 },
  { name: 'Maine', abbr: 'ME', rate: 5.50, avgLocal: 0, avgCombined: 5.50 },
  { name: 'Maryland', abbr: 'MD', rate: 6.00, avgLocal: 0, avgCombined: 6.00 },
  { name: 'Massachusetts', abbr: 'MA', rate: 6.25, avgLocal: 0, avgCombined: 6.25 },
  { name: 'Michigan', abbr: 'MI', rate: 6.00, avgLocal: 0, avgCombined: 6.00 },
  { name: 'Minnesota', abbr: 'MN', rate: 6.875, avgLocal: 0.55, avgCombined: 7.43 },
  { name: 'Mississippi', abbr: 'MS', rate: 7.00, avgLocal: 0.07, avgCombined: 7.07 },
  { name: 'Missouri', abbr: 'MO', rate: 4.225, avgLocal: 3.98, avgCombined: 8.21 },
  { name: 'Montana', abbr: 'MT', rate: 0, avgLocal: 0, avgCombined: 0 },
  { name: 'Nebraska', abbr: 'NE', rate: 5.50, avgLocal: 1.44, avgCombined: 6.94 },
  { name: 'Nevada', abbr: 'NV', rate: 6.85, avgLocal: 1.38, avgCombined: 8.23 },
  { name: 'New Hampshire', abbr: 'NH', rate: 0, avgLocal: 0, avgCombined: 0 },
  { name: 'New Jersey', abbr: 'NJ', rate: 6.625, avgLocal: 0, avgCombined: 6.625 },
  { name: 'New Mexico', abbr: 'NM', rate: 5.125, avgLocal: 2.69, avgCombined: 7.82 },
  { name: 'New York', abbr: 'NY', rate: 4.00, avgLocal: 4.52, avgCombined: 8.52 },
  { name: 'North Carolina', abbr: 'NC', rate: 4.75, avgLocal: 2.22, avgCombined: 6.97 },
  { name: 'North Dakota', abbr: 'ND', rate: 5.00, avgLocal: 1.85, avgCombined: 6.85 },
  { name: 'Ohio', abbr: 'OH', rate: 5.75, avgLocal: 1.47, avgCombined: 7.22 },
  { name: 'Oklahoma', abbr: 'OK', rate: 4.50, avgLocal: 4.44, avgCombined: 8.94 },
  { name: 'Oregon', abbr: 'OR', rate: 0, avgLocal: 0, avgCombined: 0 },
  { name: 'Pennsylvania', abbr: 'PA', rate: 6.00, avgLocal: 0.34, avgCombined: 6.34 },
  { name: 'Rhode Island', abbr: 'RI', rate: 7.00, avgLocal: 0, avgCombined: 7.00 },
  { name: 'South Carolina', abbr: 'SC', rate: 6.00, avgLocal: 1.43, avgCombined: 7.43 },
  { name: 'South Dakota', abbr: 'SD', rate: 4.50, avgLocal: 1.90, avgCombined: 6.40 },
  { name: 'Tennessee', abbr: 'TN', rate: 7.00, avgLocal: 2.47, avgCombined: 9.47 },
  { name: 'Texas', abbr: 'TX', rate: 6.25, avgLocal: 1.94, avgCombined: 8.19 },
  { name: 'Utah', abbr: 'UT', rate: 6.10, avgLocal: 0.99, avgCombined: 7.09 },
  { name: 'Vermont', abbr: 'VT', rate: 6.00, avgLocal: 0.24, avgCombined: 6.24 },
  { name: 'Virginia', abbr: 'VA', rate: 5.30, avgLocal: 0.45, avgCombined: 5.75 },
  { name: 'Washington', abbr: 'WA', rate: 6.50, avgLocal: 2.67, avgCombined: 9.17 },
  { name: 'West Virginia', abbr: 'WV', rate: 6.00, avgLocal: 0.39, avgCombined: 6.39 },
  { name: 'Wisconsin', abbr: 'WI', rate: 5.00, avgLocal: 0.44, avgCombined: 5.44 },
  { name: 'Wyoming', abbr: 'WY', rate: 4.00, avgLocal: 1.36, avgCombined: 5.36 },
];

function generateHTML(state) {
  const slug = `${state.name.toLowerCase().replace(/ /g, '-')}-sales-tax-calculator`;
  
  const hasNoTax = state.rate === 0;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.name} Sales Tax Calculator - Free ${state.abbr} Sales Tax Tool | ToolPulse</title>
    <meta name="description" content="Calculate ${state.name} sales tax on purchases. Free ${state.abbr} sales tax calculator with state and local rates.">
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
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #f0f4ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea; }
        .stat-card h3 { font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 1.5rem; font-weight: 700; color: #667eea; }
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
        @media (max-width: 768px) { .header h1 { font-size: 1.5rem; } .stat-grid { grid-template-columns: 1fr; } }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${state.name} Sales Tax Calculator</h1>
            <p>Calculate sales tax on purchases in ${state.name}</p>
        </div>
    </div>

    <div class="main container">
        <div class="calc-box">
            <h2>${state.name} Sales Tax Rates</h2>
            <div class="stat-grid">
                <div class="stat-card">
                    <h3>State Rate</h3>
                    <div class="value">${state.rate}%</div>
                </div>
                <div class="stat-card">
                    <h3>Avg Local Rate</h3>
                    <div class="value">${state.avgLocal}%</div>
                </div>
                <div class="stat-card">
                    <h3>Avg Combined</h3>
                    <div class="value">${state.avgCombined}%</div>
                </div>
            </div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="calc-box">
            <h2>Calculate Sales Tax</h2>
            <div class="input-group">
                <label for="purchase-price">Purchase Price ($):</label>
                <input type="number" id="purchase-price" min="0" value="100" step="0.01">
            </div>
            <div class="input-group">
                <label for="tax-rate">Tax Rate (%):</label>
                <input type="number" id="tax-rate" min="0" max="15" value="${state.avgCombined}" step="0.01">
                <small>Default: ${state.avgCombined}% (average combined rate). Adjust for your specific location.</small>
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Total</button>
            <div class="result-box" id="result">
                <h3>Results</h3>
            </div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About ${state.name} Sales Tax</h3>
            ${hasNoTax 
              ? `<p>${state.name} is one of 5 states with no statewide sales tax. However, some local jurisdictions may impose sales taxes.</p>`
              : `<p>The ${state.name} state sales tax rate is ${state.rate}%. Local jurisdictions may add additional sales tax, with the average combined rate being ${state.avgCombined}%.</p>`
            }
            <p><strong>Sales tax in ${state.name}:</strong></p>
            <ul>
                <li>State rate: ${state.rate}%</li>
                <li>Average local rate: ${state.avgLocal}%</li>
                <li>Average combined rate: ${state.avgCombined}%</li>
                ${hasNoTax ? '<li>Check with your local jurisdiction for specific rates</li>' : ''}
            </ul>
            <h3>More ${state.name} Tools</h3>
            <ul>
                <li><a href="index.html">ToolPulse Home - All Tools</a></li>
                <li><a href="${state.name.toLowerCase().replace(/ /g, '-')}-income-tax-calculator.html">${state.name} Income Tax Calculator</a></li>
                <li><a href="${state.name.toLowerCase().replace(/ /g, '-')}-property-tax-calculator.html">${state.name} Property Tax Calculator</a></li>
            </ul>
        </div>

        <div class="ad-placeholder">


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
            const price = parseFloat(document.getElementById('purchase-price').value);
            const taxRate = parseFloat(document.getElementById('tax-rate').value) / 100;
            
            const taxAmount = price * taxRate;
            const total = price + taxAmount;
            
            let html = '<h3>Sales Tax Calculation</h3>';
            html += '<div class="result-value">Total: $' + total.toFixed(2) + '</div>';
            html += '<div class="result-detail">Purchase Price: $' + price.toFixed(2) + '</div>';
            html += '<div class="result-detail">Sales Tax: $' + taxAmount.toFixed(2) + ' (' + (taxRate * 100).toFixed(2) + '%)</div>';
            
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
  const slug = `${state.name.toLowerCase().replace(/ /g, '-')}-sales-tax-calculator`;
  fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
  count++;
  console.log(`✓ Generated ${slug}.html`);
});

console.log(`\n✅ Generated ${count} sales tax calculators (ALL 50 STATES)`);
console.log('📝 High search volume: "[state] sales tax calculator"');
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
