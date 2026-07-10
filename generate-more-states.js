#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Additional 15 high-population states
const states = [
  { name: 'Arizona', abbr: 'AZ', hasTax: true, rate: 2.5, brackets: true },
  { name: 'Colorado', abbr: 'CO', hasTax: true, rate: 4.4, brackets: false },
  { name: 'Indiana', abbr: 'IN', hasTax: true, rate: 3.15, brackets: false },
  { name: 'Maryland', abbr: 'MD', hasTax: true, rate: 5.75, brackets: true },
  { name: 'Massachusetts', abbr: 'MA', hasTax: true, rate: 5.0, brackets: false },
  { name: 'Minnesota', abbr: 'MN', hasTax: true, rate: 9.85, brackets: true },
  { name: 'Missouri', abbr: 'MO', hasTax: true, rate: 4.95, brackets: true },
  { name: 'New Jersey', abbr: 'NJ', hasTax: true, rate: 10.75, brackets: true },
  { name: 'Tennessee', abbr: 'TN', hasTax: false, rate: 0, brackets: false },
  { name: 'Virginia', abbr: 'VA', hasTax: true, rate: 5.75, brackets: true },
  { name: 'Washington', abbr: 'WA', hasTax: false, rate: 0, brackets: false },
  { name: 'Wisconsin', abbr: 'WI', hasTax: true, rate: 7.65, brackets: true },
  { name: 'Alabama', abbr: 'AL', hasTax: true, rate: 5.0, brackets: true },
  { name: 'South Carolina', abbr: 'SC', hasTax: true, rate: 6.5, brackets: true },
  { name: 'Louisiana', abbr: 'LA', hasTax: true, rate: 4.25, brackets: true },
];

function generateHTML(state) {
  const slug = `${state.name.toLowerCase().replace(/ /g, '-')}-income-tax-calculator`;
  
  const taxLogic = state.hasTax ? `
    const income = parseFloat(document.getElementById('income').value);
    const filingStatus = document.getElementById('filing').value;
    
    // Simplified state tax calculation
    let stateTax = 0;
    ${state.brackets ? `
    // Progressive tax brackets (simplified)
    if (income <= 50000) {
      stateTax = income * ${state.rate * 0.5 / 100};
    } else if (income <= 100000) {
      stateTax = 50000 * ${state.rate * 0.5 / 100} + (income - 50000) * ${state.rate * 0.75 / 100};
    } else {
      stateTax = 50000 * ${state.rate * 0.5 / 100} + 50000 * ${state.rate * 0.75 / 100} + (income - 100000) * ${state.rate / 100};
    }
    ` : `
    // Flat tax rate
    stateTax = income * ${state.rate / 100};
    `}
    
    // Federal tax (simplified)
    let federalTax = 0;
    if (income <= 44725) {
      federalTax = income * 0.12;
    } else if (income <= 95375) {
      federalTax = 5367 + (income - 44725) * 0.22;
    } else if (income <= 182100) {
      federalTax = 16710 + (income - 95375) * 0.24;
    } else {
      federalTax = 37584 + (income - 182100) * 0.32;
    }
    
    const totalTax = stateTax + federalTax;
    const effectiveRate = (totalTax / income) * 100;
    const takeHome = income - totalTax;
    
    html += '<div class="result-value">Take-Home Pay: $' + takeHome.toLocaleString() + '</div>';
    html += '<div class="result-detail">Gross Income: $' + income.toLocaleString() + '</div>';
    html += '<div class="result-detail">${state.name} State Tax: $' + stateTax.toFixed(2).toLocaleString() + '</div>';
    html += '<div class="result-detail">Federal Tax: $' + federalTax.toFixed(2).toLocaleString() + '</div>';
    html += '<div class="result-detail">Total Tax: $' + totalTax.toFixed(2).toLocaleString() + '</div>';
    html += '<div class="result-detail">Effective Tax Rate: ' + effectiveRate.toFixed(2) + '%</div>';
  ` : `
    const income = parseFloat(document.getElementById('income').value);
    
    // No state income tax
    let federalTax = 0;
    if (income <= 44725) {
      federalTax = income * 0.12;
    } else if (income <= 95375) {
      federalTax = 5367 + (income - 44725) * 0.22;
    } else if (income <= 182100) {
      federalTax = 16710 + (income - 95375) * 0.24;
    } else {
      federalTax = 37584 + (income - 182100) * 0.32;
    }
    
    const takeHome = income - federalTax;
    const effectiveRate = (federalTax / income) * 100;
    
    html += '<div class="result-value">Take-Home Pay: $' + takeHome.toLocaleString() + '</div>';
    html += '<div class="result-detail">Gross Income: $' + income.toLocaleString() + '</div>';
    html += '<div class="result-detail">${state.name} State Tax: $0 (no state income tax)</div>';
    html += '<div class="result-detail">Federal Tax: $' + federalTax.toFixed(2).toLocaleString() + '</div>';
    html += '<div class="result-detail">Effective Tax Rate: ' + effectiveRate.toFixed(2) + '%</div>';
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.name} Income Tax Calculator - Free ${state.abbr} Tax Tool | CalcLeap</title>
    <meta name="description" content="Calculate ${state.name} state income tax and take-home pay. Free ${state.abbr} income tax calculator with federal tax estimates.">
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
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; transition: border 0.3s; }
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
            <h1>${state.name} Income Tax Calculator</h1>
            <p>Calculate ${state.name} state income tax and take-home pay for 2026</p>
        </div>
    </div>

    <div class="main container">
        <div class="ad-placeholder">


        </div>

        <div class="calc-box">
            <h2>${state.name} Tax Calculator</h2>
            <div class="input-group">
                <label for="income">Annual Income ($):</label>
                <input type="number" id="income" min="0" value="75000">
            </div>
            <div class="input-group">
                <label for="filing">Filing Status:</label>
                <select id="filing">
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                    <option value="hoh">Head of Household</option>
                </select>
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Taxes</button>
            <div class="result-box" id="result">
                <h3>Tax Results</h3>
            </div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About ${state.name} Income Tax</h3>
            <p>${state.hasTax 
              ? `${state.name} has a ${state.brackets ? 'progressive' : 'flat'} state income tax with a top rate of ${state.rate}%.`
              : `${state.name} is one of ${state.abbr === 'TN' || state.abbr === 'WA' ? '9' : 'several'} states with no state income tax.`
            }</p>
            <h3>More Tax & Financial Tools</h3>
            <ul>
                <li><a href="index.html">CalcLeap Home - All Tools</a></li>
                <li><a href="https://calcleap.com/">SmartCalc - Financial Calculators</a></li>
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
            const resultBox = document.getElementById('result');
            let html = '';
            
            ${taxLogic}
            
            resultBox.innerHTML = '<h3>Tax Results</h3>' + html;
            resultBox.style.display = 'block';
        }
    </script>
</body>
</html>`;
}

let count = 0;
states.forEach(state => {
  const html = generateHTML(state);
  const slug = `${state.name.toLowerCase().replace(/ /g, '-')}-income-tax-calculator`;
  fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
  count++;
  console.log(`✓ Generated ${slug}.html`);
});

console.log(`\n✅ Generated ${count} state income tax calculators`);
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
