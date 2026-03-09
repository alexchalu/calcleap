#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-volume mortgage & finance calculators
const calculators = [
  {
    slug: 'mortgage-refinance-calculator',
    title: 'Mortgage Refinance Calculator',
    desc: 'Calculate if refinancing your mortgage will save you money. Compare monthly payments and total interest.',
    category: 'Mortgage Refinance',
    inputs: [
      { id: 'current-balance', label: 'Current Loan Balance ($)', type: 'number', min: 0, default: 250000 },
      { id: 'current-rate', label: 'Current Interest Rate (%)', type: 'number', min: 0, max: 20, step: 0.01, default: 6.5 },
      { id: 'current-years', label: 'Years Remaining', type: 'number', min: 1, max: 30, default: 25 },
      { id: 'new-rate', label: 'New Interest Rate (%)', type: 'number', min: 0, max: 20, step: 0.01, default: 5.5 },
      { id: 'new-term', label: 'New Loan Term (years)', type: 'select', options: ['15', '20', '30'] },
      { id: 'closing-costs', label: 'Closing Costs ($)', type: 'number', min: 0, default: 3000 },
    ]
  },
  {
    slug: 'heloc-payment-calculator',
    title: 'HELOC Payment Calculator',
    desc: 'Calculate Home Equity Line of Credit payments and compare draw vs repayment periods.',
    category: 'Home Equity',
    inputs: [
      { id: 'credit-limit', label: 'HELOC Credit Limit ($)', type: 'number', min: 0, default: 100000 },
      { id: 'amount-drawn', label: 'Amount Drawn ($)', type: 'number', min: 0, default: 50000 },
      { id: 'interest-rate', label: 'Interest Rate (%)', type: 'number', min: 0, max: 20, step: 0.01, default: 7.5 },
      { id: 'draw-period', label: 'Draw Period (years)', type: 'number', min: 1, max: 20, default: 10 },
      { id: 'repay-period', label: 'Repayment Period (years)', type: 'number', min: 1, max: 30, default: 20 },
    ]
  },
  {
    slug: '401k-withdrawal-calculator',
    title: '401k Withdrawal Calculator',
    desc: 'Calculate taxes and penalties on 401k early withdrawals. See how much you\'ll actually receive.',
    category: 'Retirement Withdrawal',
    inputs: [
      { id: 'withdrawal-amount', label: 'Withdrawal Amount ($)', type: 'number', min: 0, default: 50000 },
      { id: 'age', label: 'Your Age', type: 'number', min: 18, max: 100, default: 45 },
      { id: 'tax-bracket', label: 'Federal Tax Bracket', type: 'select', options: ['10%', '12%', '22%', '24%', '32%', '35%', '37%'] },
      { id: 'state-tax', label: 'State Tax Rate (%)', type: 'number', min: 0, max: 15, step: 0.1, default: 5 },
    ]
  },
  {
    slug: 'roth-ira-conversion-calculator',
    title: 'Roth IRA Conversion Calculator',
    desc: 'Calculate the tax impact of converting a traditional IRA to a Roth IRA.',
    category: 'IRA Conversion',
    inputs: [
      { id: 'conversion-amount', label: 'Conversion Amount ($)', type: 'number', min: 0, default: 100000 },
      { id: 'current-income', label: 'Annual Income ($)', type: 'number', min: 0, default: 75000 },
      { id: 'filing-status', label: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] },
      { id: 'state-tax', label: 'State Tax Rate (%)', type: 'number', min: 0, max: 15, step: 0.1, default: 5 },
    ]
  },
  {
    slug: 'reverse-mortgage-calculator',
    title: 'Reverse Mortgage Calculator',
    desc: 'Estimate how much you can borrow with a reverse mortgage (HECM).',
    category: 'Reverse Mortgage',
    inputs: [
      { id: 'home-value', label: 'Home Value ($)', type: 'number', min: 0, default: 400000 },
      { id: 'youngest-age', label: 'Youngest Borrower Age', type: 'number', min: 62, max: 100, default: 65 },
      { id: 'mortgage-balance', label: 'Existing Mortgage Balance ($)', type: 'number', min: 0, default: 0 },
      { id: 'interest-rate', label: 'Expected Interest Rate (%)', type: 'number', min: 0, max: 10, step: 0.1, default: 5.5 },
    ]
  },
  {
    slug: 'debt-consolidation-calculator',
    title: 'Debt Consolidation Calculator',
    desc: 'See if consolidating your debts will save you money on interest and monthly payments.',
    category: 'Debt Consolidation',
    inputs: [
      { id: 'total-debt', label: 'Total Debt Amount ($)', type: 'number', min: 0, default: 25000 },
      { id: 'avg-rate', label: 'Average Interest Rate (%)', type: 'number', min: 0, max: 30, step: 0.1, default: 18 },
      { id: 'monthly-payment', label: 'Current Monthly Payment ($)', type: 'number', min: 0, default: 750 },
      { id: 'consolidation-rate', label: 'Consolidation Loan Rate (%)', type: 'number', min: 0, max: 20, step: 0.1, default: 10 },
      { id: 'consolidation-term', label: 'Consolidation Term (years)', type: 'select', options: ['3', '5', '7', '10'] },
    ]
  },
];

function generateHTML(calc) {
  const inputsHTML = calc.inputs.map(input => {
    if (input.type === 'select') {
      return `
        <div class="input-group">
          <label for="${input.id}">${input.label}:</label>
          <select id="${input.id}">
            ${input.options.map(opt => `<option value="${opt}">${opt}</option>`).join('\n')}
          </select>
        </div>`;
    } else {
      return `
        <div class="input-group">
          <label for="${input.id}">${input.label}:</label>
          <input type="${input.type}" id="${input.id}" ${input.placeholder ? `placeholder="${input.placeholder}"` : ''} ${input.min !== undefined ? `min="${input.min}"` : ''} ${input.max !== undefined ? `max="${input.max}"` : ''} ${input.step !== undefined ? `step="${input.step}"` : ''} ${input.default !== undefined ? `value="${input.default}"` : ''}>
        </div>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free ${calc.category} Tool | ToolPulse</title>
    <meta name="description" content="${calc.desc}. Free ${calc.category.toLowerCase()} calculator with instant results.">
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
        .info-section ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .info-section ul li { margin-bottom: 0.5rem; }
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
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calc-box">
            <h2>${calc.category} Calculator</h2>
            ${inputsHTML}
            <button class="calc-btn" onclick="calculate()">Calculate</button>
            <div class="result-box" id="result"></div>
        </div>

        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-section">
            <h3>About ${calc.category}</h3>
            <p>Use this ${calc.title.toLowerCase()} to make informed financial decisions. All calculations are estimates based on the information provided.</p>
            <h3>More Financial Tools</h3>
            <ul>
                <li><a href="index.html">ToolPulse Home - All Tools</a></li>
                <li><a href="https://alexchalu.github.io/smartcalc/">SmartCalc - Financial Calculators</a></li>
                <li><a href="https://alexchalu.github.io/healthcalcs/">HealthCalcs - Health & Wellness</a></li>
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
            <p><a href="index.html">Home</a> | <a href="https://alexchalu.github.io/smartcalc/">SmartCalc</a></p>
        </div>
    </div>

    <script>
        function calculate() {
            const resultBox = document.getElementById('result');
            let html = '<h3>Results</h3>';
            
            ${calc.slug === 'mortgage-refinance-calculator' ? `
            const balance = parseFloat(document.getElementById('current-balance').value);
            const currentRate = parseFloat(document.getElementById('current-rate').value) / 100 / 12;
            const currentYears = parseFloat(document.getElementById('current-years').value);
            const newRate = parseFloat(document.getElementById('new-rate').value) / 100 / 12;
            const newTerm = parseInt(document.getElementById('new-term').value);
            const closingCosts = parseFloat(document.getElementById('closing-costs').value);
            
            const currentMonths = currentYears * 12;
            const currentPayment = balance * (currentRate * Math.pow(1 + currentRate, currentMonths)) / (Math.pow(1 + currentRate, currentMonths) - 1);
            
            const newMonths = newTerm * 12;
            const newPayment = balance * (newRate * Math.pow(1 + newRate, newMonths)) / (Math.pow(1 + newRate, newMonths) - 1);
            
            const monthlySavings = currentPayment - newPayment;
            const breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
            
            html += '<div class="result-value">$' + newPayment.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Current Payment: $' + currentPayment.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Monthly Savings: $' + monthlySavings.toFixed(2) + '</div>';
            html += '<div class="result-detail">Break-even: ' + breakEvenMonths + ' months</div>';
            ` : ''}
            
            ${calc.slug === 'heloc-payment-calculator' ? `
            const drawn = parseFloat(document.getElementById('amount-drawn').value);
            const rate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12;
            const drawYears = parseFloat(document.getElementById('draw-period').value);
            const repayYears = parseFloat(document.getElementById('repay-period').value);
            
            const drawPayment = drawn * rate;
            const repayMonths = repayYears * 12;
            const repayPayment = drawn * (rate * Math.pow(1 + rate, repayMonths)) / (Math.pow(1 + rate, repayMonths) - 1);
            
            html += '<div class="result-value">Draw Period: $' + drawPayment.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Repayment Period: $' + repayPayment.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Interest-only for ' + drawYears + ' years, then principal + interest</div>';
            ` : ''}
            
            ${calc.slug === '401k-withdrawal-calculator' ? `
            const amount = parseFloat(document.getElementById('withdrawal-amount').value);
            const age = parseInt(document.getElementById('age').value);
            const federalTax = parseFloat(document.getElementById('tax-bracket').value) / 100;
            const stateTax = parseFloat(document.getElementById('state-tax').value) / 100;
            
            const penalty = age < 59.5 ? amount * 0.10 : 0;
            const federalWithholding = amount * federalTax;
            const stateWithholding = amount * stateTax;
            const totalTaxes = penalty + federalWithholding + stateWithholding;
            const netAmount = amount - totalTaxes;
            
            html += '<div class="result-value">You\'ll Receive: $' + netAmount.toFixed(2) + '</div>';
            html += '<div class="result-detail">Withdrawal: $' + amount.toFixed(2) + '</div>';
            if (penalty > 0) html += '<div class="result-detail">Early Withdrawal Penalty (10%): $' + penalty.toFixed(2) + '</div>';
            html += '<div class="result-detail">Federal Tax: $' + federalWithholding.toFixed(2) + '</div>';
            html += '<div class="result-detail">State Tax: $' + stateWithholding.toFixed(2) + '</div>';
            html += '<div class="result-detail">Total Taxes & Penalties: $' + totalTaxes.toFixed(2) + '</div>';
            ` : ''}
            
            ${calc.slug === 'roth-ira-conversion-calculator' ? `
            const convAmount = parseFloat(document.getElementById('conversion-amount').value);
            const income = parseFloat(document.getElementById('current-income').value);
            const stateTax = parseFloat(document.getElementById('state-tax').value) / 100;
            
            const totalIncome = income + convAmount;
            let federalTax = 0;
            if (totalIncome <= 11000) federalTax = totalIncome * 0.10;
            else if (totalIncome <= 44725) federalTax = 1100 + (totalIncome - 11000) * 0.12;
            else if (totalIncome <= 95375) federalTax = 5147 + (totalIncome - 44725) * 0.22;
            else federalTax = 16290 + (totalIncome - 95375) * 0.24;
            
            const taxOnIncome = income * 0.22;
            const taxOnConversion = federalTax - taxOnIncome;
            const stateTaxAmount = convAmount * stateTax;
            const totalTax = taxOnConversion + stateTaxAmount;
            
            html += '<div class="result-value">Tax on Conversion: $' + totalTax.toFixed(2) + '</div>';
            html += '<div class="result-detail">Federal Tax: $' + taxOnConversion.toFixed(2) + '</div>';
            html += '<div class="result-detail">State Tax: $' + stateTaxAmount.toFixed(2) + '</div>';
            html += '<div class="result-detail">Conversion Amount: $' + convAmount.toFixed(2) + '</div>';
            ` : ''}
            
            ${calc.slug === 'reverse-mortgage-calculator' ? `
            const homeValue = parseFloat(document.getElementById('home-value').value);
            const age = parseInt(document.getElementById('youngest-age').value);
            const mortgageBalance = parseFloat(document.getElementById('mortgage-balance').value);
            
            let plf = 0.40;
            if (age >= 70) plf = 0.50;
            else if (age >= 65) plf = 0.45;
            
            const maxLoan = homeValue * plf;
            const available = maxLoan - mortgageBalance;
            
            html += '<div class="result-value">Available: $' + available.toFixed(2) + '</div>';
            html += '<div class="result-detail">Maximum Loan: $' + maxLoan.toFixed(2) + '</div>';
            html += '<div class="result-detail">Existing Mortgage: $' + mortgageBalance.toFixed(2) + '</div>';
            html += '<div class="result-detail">Principal Limit Factor: ' + (plf * 100).toFixed(0) + '%</div>';
            ` : ''}
            
            ${calc.slug === 'debt-consolidation-calculator' ? `
            const debt = parseFloat(document.getElementById('total-debt').value);
            const avgRate = parseFloat(document.getElementById('avg-rate').value) / 100 / 12;
            const currentPayment = parseFloat(document.getElementById('monthly-payment').value);
            const newRate = parseFloat(document.getElementById('consolidation-rate').value) / 100 / 12;
            const term = parseInt(document.getElementById('consolidation-term').value) * 12;
            
            const newPayment = debt * (newRate * Math.pow(1 + newRate, term)) / (Math.pow(1 + newRate, term) - 1);
            const savings = currentPayment - newPayment;
            const totalSavings = savings * term;
            
            html += '<div class="result-value">New Payment: $' + newPayment.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Current Payment: $' + currentPayment.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Monthly Savings: $' + savings.toFixed(2) + '</div>';
            html += '<div class="result-detail">Total Savings Over ' + (term/12) + ' Years: $' + totalSavings.toFixed(2) + '</div>';
            ` : ''}
            
            resultBox.innerHTML = html;
            resultBox.style.display = 'block';
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

console.log(`\n✅ Generated ${count} high-volume mortgage & finance calculators`);
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
