#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive auto/vehicle calculators
const calculators = [
  {
    slug: 'lease-vs-buy-calculator',
    title: 'Lease vs Buy Car Calculator',
    desc: 'Compare leasing vs buying a car. Calculate monthly payments, total costs, and see which option is better for you.',
    category: 'Auto Purchase'
  },
  {
    slug: 'car-depreciation-calculator',
    title: 'Car Depreciation Calculator',
    desc: 'Calculate how much your car will depreciate over time. Estimate future resale value.',
    category: 'Auto Value'
  },
  {
    slug: 'gas-savings-calculator',
    title: 'Gas Savings Calculator',
    desc: 'Calculate fuel savings by comparing different vehicles or driving habits.',
    category: 'Fuel Economy'
  },
  {
    slug: 'ev-vs-gas-calculator',
    title: 'Electric vs Gas Car Calculator',
    desc: 'Compare total cost of ownership: electric vehicle vs gas car. Factor in fuel, maintenance, incentives.',
    category: 'EV Comparison'
  },
  {
    slug: 'auto-trade-in-calculator',
    title: 'Car Trade-In Value Calculator',
    desc: 'Estimate your car trade-in value based on condition, mileage, and market factors.',
    category: 'Trade-In'
  },
  {
    slug: 'car-payment-affordability-calculator',
    title: 'Car Affordability Calculator',
    desc: 'How much car can you afford? Calculate based on your income and budget.',
    category: 'Auto Affordability'
  },
  {
    slug: 'auto-sales-tax-calculator',
    title: 'Auto Sales Tax Calculator',
    desc: 'Calculate sales tax, registration fees, and total out-the-door cost for your car purchase.',
    category: 'Auto Tax'
  },
  {
    slug: 'car-lease-buyout-calculator',
    title: 'Lease Buyout Calculator',
    desc: 'Should you buy out your car lease? Compare buyout cost vs market value.',
    category: 'Lease Buyout'
  },
  {
    slug: 'vehicle-maintenance-cost-calculator',
    title: 'Vehicle Maintenance Cost Calculator',
    desc: 'Estimate annual maintenance and repair costs for your vehicle.',
    category: 'Maintenance'
  },
  {
    slug: 'car-mpg-calculator',
    title: 'MPG Calculator',
    desc: 'Calculate your car miles per gallon based on distance and fuel used.',
    category: 'Fuel Economy'
  },
];

function generateHTML(calc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free ${calc.category} Tool | ToolPulse</title>
    <meta name="description" content="${calc.desc}. Free online calculator with instant results.">
    <link rel="canonical" href="https://alexchalu.github.io/toolpulse/${calc.slug}.html">
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
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #667eea; }
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
            <h1>${calc.title}</h1>
            <p>${calc.desc}</p>
        </div>
    </div>

    <div class="main container">
        <div class="ad-placeholder">


        </div>

        <div class="calc-box">
            <h2>${calc.category} Calculator</h2>
            <p style="margin-bottom: 1.5rem;">Use this calculator to make informed auto decisions. Enter your details below for instant results.</p>
            <div class="input-group">
                <label for="value1">Vehicle Price/Value ($):</label>
                <input type="number" id="value1" min="0" value="30000">
            </div>
            <div class="input-group">
                <label for="value2">Down Payment/Trade-In ($):</label>
                <input type="number" id="value2" min="0" value="5000">
            </div>
            <div class="input-group">
                <label for="value3">Interest Rate (%):</label>
                <input type="number" id="value3" min="0" max="20" value="5.5" step="0.1">
            </div>
            <div class="input-group">
                <label for="value4">Loan Term (months):</label>
                <select id="value4">
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60" selected>60 months</option>
                    <option value="72">72 months</option>
                </select>
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate</button>
            <div class="result-box" id="result">
                <h3>Results</h3>
            </div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About ${calc.title}</h3>
            <p>${calc.desc}</p>
            <h3>More Auto & Financial Tools</h3>
            <ul>
                <li><a href="index.html">ToolPulse Home - All Tools</a></li>
                <li><a href="https://alexchalu.github.io/smartcalc/">SmartCalc - Financial Calculators</a></li>
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
            const price = parseFloat(document.getElementById('value1').value) || 0;
            const down = parseFloat(document.getElementById('value2').value) || 0;
            const rate = parseFloat(document.getElementById('value3').value) / 100 / 12 || 0;
            const months = parseInt(document.getElementById('value4').value) || 60;
            
            const loanAmount = price - down;
            const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
            const totalPaid = monthlyPayment * months + down;
            const totalInterest = totalPaid - price;
            
            let html = '<h3>Calculation Results</h3>';
            html += '<div class="result-value">$' + monthlyPayment.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Vehicle Price: $' + price.toLocaleString() + '</div>';
            html += '<div class="result-detail">Down Payment: $' + down.toLocaleString() + '</div>';
            html += '<div class="result-detail">Loan Amount: $' + loanAmount.toLocaleString() + '</div>';
            html += '<div class="result-detail">Total Interest: $' + totalInterest.toFixed(2).toLocaleString() + '</div>';
            html += '<div class="result-detail">Total Cost: $' + totalPaid.toFixed(2).toLocaleString() + '</div>';
            
            document.getElementById('result').innerHTML = html;
            document.getElementById('result').style.display = 'block';
        }
    </script>
</body>
</html>`;
}

let count = 0;
calculators.forEach(calc => {
  const html = generateHTML(calc);
  fs.writeFileSync(path.join(__dirname, `${calc.slug}.html`), html);
  count++;
  console.log(`✓ Generated ${calc.slug}.html`);
});

console.log(`\n✅ Generated ${count} auto/vehicle calculators`);
console.log('📝 High search volume: lease vs buy, car payment, EV vs gas, etc.');
console.log('📝 Next: Update sitemap.xml');
