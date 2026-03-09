#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Retirement planning calculators - high search volume
const calculators = [
  {
    slug: 'early-retirement-calculator',
    title: 'Early Retirement Calculator',
    desc: 'Calculate when you can retire early using the FIRE method (Financial Independence, Retire Early).',
    category: 'Early Retirement',
    inputs: [
      { id: 'current-age', label: 'Current Age', type: 'number', min: 18, max: 100, default: 30 },
      { id: 'current-savings', label: 'Current Savings ($)', type: 'number', min: 0, default: 50000 },
      { id: 'annual-income', label: 'Annual Income ($)', type: 'number', min: 0, default: 75000 },
      { id: 'annual-expenses', label: 'Annual Expenses ($)', type: 'number', min: 0, default: 40000 },
      { id: 'savings-rate', label: 'Monthly Savings ($)', type: 'number', min: 0, default: 2000 },
      { id: 'return-rate', label: 'Expected Return (%)', type: 'number', min: 0, max: 20, default: 7, step: 0.1 },
    ]
  },
  {
    slug: 'social-security-calculator',
    title: 'Social Security Calculator',
    desc: 'Estimate your Social Security retirement benefits based on earnings and retirement age.',
    category: 'Social Security',
    inputs: [
      { id: 'birth-year', label: 'Birth Year', type: 'number', min: 1940, max: 2010, default: 1980 },
      { id: 'avg-earnings', label: 'Average Annual Earnings ($)', type: 'number', min: 0, default: 60000 },
      { id: 'retirement-age', label: 'Planned Retirement Age', type: 'select', options: ['62', '65', '67', '70'] },
      { id: 'filing-status', label: 'Filing Status', type: 'select', options: ['Single', 'Married'] },
    ]
  },
  {
    slug: 'pension-calculator',
    title: 'Pension Calculator',
    desc: 'Calculate pension benefits and compare lump sum vs monthly payments.',
    category: 'Pension',
    inputs: [
      { id: 'years-service', label: 'Years of Service', type: 'number', min: 0, max: 50, default: 25 },
      { id: 'final-salary', label: 'Final Average Salary ($)', type: 'number', min: 0, default: 80000 },
      { id: 'multiplier', label: 'Pension Multiplier (%)', type: 'number', min: 0, max: 5, default: 2, step: 0.1 },
      { id: 'cola', label: 'Annual COLA (%)', type: 'number', min: 0, max: 10, default: 2, step: 0.1 },
    ]
  },
  {
    slug: 'required-minimum-distribution-calculator',
    title: 'Required Minimum Distribution Calculator',
    desc: 'Calculate RMD for IRA and 401k accounts after age 73.',
    category: 'RMD',
    inputs: [
      { id: 'account-balance', label: 'Account Balance ($)', type: 'number', min: 0, default: 500000 },
      { id: 'age', label: 'Your Age', type: 'number', min: 73, max: 100, default: 75 },
      { id: 'spouse-age', label: 'Spouse Age (if applicable)', type: 'number', min: 0, max: 100, default: 0 },
    ]
  },
  {
    slug: 'annuity-calculator',
    title: 'Annuity Calculator',
    desc: 'Calculate annuity payments and compare immediate vs deferred annuities.',
    category: 'Annuity',
    inputs: [
      { id: 'principal', label: 'Principal Amount ($)', type: 'number', min: 0, default: 250000 },
      { id: 'age', label: 'Your Age', type: 'number', min: 40, max: 90, default: 65 },
      { id: 'annuity-type', label: 'Annuity Type', type: 'select', options: ['Immediate', 'Deferred (5 years)', 'Deferred (10 years)'] },
      { id: 'payment-period', label: 'Payment Period', type: 'select', options: ['Life Only', 'Life + 10 Years Certain', 'Life + 20 Years Certain', 'Joint Life'] },
      { id: 'rate', label: 'Payout Rate (%)', type: 'number', min: 0, max: 10, default: 5, step: 0.1 },
    ]
  },
  {
    slug: 'retirement-withdrawal-calculator',
    title: 'Retirement Withdrawal Calculator',
    desc: 'Calculate safe withdrawal rates using the 4% rule and other strategies.',
    category: 'Retirement Withdrawal',
    inputs: [
      { id: 'portfolio-value', label: 'Portfolio Value ($)', type: 'number', min: 0, default: 1000000 },
      { id: 'withdrawal-rate', label: 'Withdrawal Rate (%)', type: 'number', min: 0, max: 10, default: 4, step: 0.1 },
      { id: 'years-retirement', label: 'Years in Retirement', type: 'number', min: 1, max: 50, default: 30 },
      { id: 'return-rate', label: 'Expected Return (%)', type: 'number', min: 0, max: 15, default: 7, step: 0.1 },
      { id: 'inflation', label: 'Inflation Rate (%)', type: 'number', min: 0, max: 10, default: 3, step: 0.1 },
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
            <p>Use this ${calc.title.toLowerCase()} to plan your retirement. All calculations are estimates for informational purposes.</p>
            <h3>More Retirement & Financial Tools</h3>
            <ul>
                <li><a href="index.html">ToolPulse Home - All Tools</a></li>
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
            const resultBox = document.getElementById('result');
            let html = '<h3>Results</h3>';
            
            ${calc.slug === 'early-retirement-calculator' ? `
            const currentAge = parseInt(document.getElementById('current-age').value);
            const currentSavings = parseFloat(document.getElementById('current-savings').value);
            const annualExpenses = parseFloat(document.getElementById('annual-expenses').value);
            const monthlySavings = parseFloat(document.getElementById('savings-rate').value);
            const returnRate = parseFloat(document.getElementById('return-rate').value) / 100;
            
            const targetAmount = annualExpenses * 25; // 4% rule
            const annualSavings = monthlySavings * 12;
            const monthlyReturn = returnRate / 12;
            
            let balance = currentSavings;
            let years = 0;
            while (balance < targetAmount && years < 50) {
                balance = balance * (1 + returnRate) + annualSavings;
                years++;
            }
            
            const retirementAge = currentAge + years;
            
            html += '<div class="result-value">Retire at Age: ' + retirementAge + '</div>';
            html += '<div class="result-detail">Years Until Retirement: ' + years + '</div>';
            html += '<div class="result-detail">Target Amount: $' + targetAmount.toLocaleString() + '</div>';
            html += '<div class="result-detail">Projected Balance: $' + balance.toFixed(0).toLocaleString() + '</div>';
            html += '<div class="result-detail">Annual Expenses: $' + annualExpenses.toLocaleString() + '</div>';
            ` : ''}
            
            ${calc.slug === 'social-security-calculator' ? `
            const avgEarnings = parseFloat(document.getElementById('avg-earnings').value);
            const retirementAge = parseInt(document.getElementById('retirement-age').value);
            
            // Simplified PIA calculation (actual formula is complex)
            let pia = avgEarnings * 0.015; // rough approximation
            
            // Adjustment for retirement age
            let multiplier = 1.0;
            if (retirementAge == 62) multiplier = 0.7;
            else if (retirementAge == 65) multiplier = 0.93;
            else if (retirementAge == 67) multiplier = 1.0;
            else if (retirementAge == 70) multiplier = 1.24;
            
            const monthlyBenefit = (pia * multiplier) / 12;
            const annualBenefit = monthlyBenefit * 12;
            
            html += '<div class="result-value">Monthly Benefit: $' + monthlyBenefit.toFixed(2) + '</div>';
            html += '<div class="result-detail">Annual Benefit: $' + annualBenefit.toFixed(2) + '</div>';
            html += '<div class="result-detail">Retirement Age: ' + retirementAge + '</div>';
            html += '<div class="result-detail">Benefit Multiplier: ' + (multiplier * 100).toFixed(0) + '%</div>';
            ` : ''}
            
            ${calc.slug === 'pension-calculator' ? `
            const years = parseFloat(document.getElementById('years-service').value);
            const salary = parseFloat(document.getElementById('final-salary').value);
            const multiplier = parseFloat(document.getElementById('multiplier').value) / 100;
            const cola = parseFloat(document.getElementById('cola').value) / 100;
            
            const annualPension = salary * years * multiplier;
            const monthlyPension = annualPension / 12;
            
            html += '<div class="result-value">Monthly Pension: $' + monthlyPension.toFixed(2) + '</div>';
            html += '<div class="result-detail">Annual Pension: $' + annualPension.toFixed(2) + '</div>';
            html += '<div class="result-detail">Years of Service: ' + years + '</div>';
            html += '<div class="result-detail">With ' + (cola * 100).toFixed(1) + '% COLA annually</div>';
            ` : ''}
            
            ${calc.slug === 'required-minimum-distribution-calculator' ? `
            const balance = parseFloat(document.getElementById('account-balance').value);
            const age = parseInt(document.getElementById('age').value);
            
            // IRS Uniform Lifetime Table (simplified)
            const lifetimeFactor = 110 - age;
            const rmd = balance / lifetimeFactor;
            const taxableIncome = rmd * 0.22; // assume 22% bracket
            
            html += '<div class="result-value">RMD Amount: $' + rmd.toFixed(2) + '</div>';
            html += '<div class="result-detail">Estimated Tax (22%): $' + taxableIncome.toFixed(2) + '</div>';
            html += '<div class="result-detail">After-Tax Amount: $' + (rmd - taxableIncome).toFixed(2) + '</div>';
            html += '<div class="result-detail">Age: ' + age + '</div>';
            ` : ''}
            
            ${calc.slug === 'annuity-calculator' ? `
            const principal = parseFloat(document.getElementById('principal').value);
            const age = parseInt(document.getElementById('age').value);
            const rate = parseFloat(document.getElementById('rate').value) / 100;
            
            const monthlyPayment = (principal * rate) / 12;
            const annualPayment = monthlyPayment * 12;
            const lifetimePayments = annualPayment * (90 - age);
            
            html += '<div class="result-value">Monthly Payment: $' + monthlyPayment.toFixed(2) + '</div>';
            html += '<div class="result-detail">Annual Payment: $' + annualPayment.toFixed(2) + '</div>';
            html += '<div class="result-detail">Estimated Lifetime Payments: $' + lifetimePayments.toLocaleString() + '</div>';
            html += '<div class="result-detail">Principal: $' + principal.toLocaleString() + '</div>';
            ` : ''}
            
            ${calc.slug === 'retirement-withdrawal-calculator' ? `
            const portfolio = parseFloat(document.getElementById('portfolio-value').value);
            const rate = parseFloat(document.getElementById('withdrawal-rate').value) / 100;
            const years = parseInt(document.getElementById('years-retirement').value);
            const returnRate = parseFloat(document.getElementById('return-rate').value) / 100;
            const inflation = parseFloat(document.getElementById('inflation').value) / 100;
            
            const firstYear = portfolio * rate;
            const monthly = firstYear / 12;
            
            // Project if portfolio will last
            let balance = portfolio;
            let withdrawal = firstYear;
            let yearsUntilDepletion = years;
            for (let i = 0; i < years; i++) {
                balance = balance * (1 + returnRate) - withdrawal;
                withdrawal = withdrawal * (1 + inflation);
                if (balance <= 0 && yearsUntilDepletion === years) {
                    yearsUntilDepletion = i + 1;
                }
            }
            
            html += '<div class="result-value">First Year: $' + firstYear.toFixed(2) + '</div>';
            html += '<div class="result-detail">Monthly (Year 1): $' + monthly.toFixed(2) + '</div>';
            html += '<div class="result-detail">Withdrawal Rate: ' + (rate * 100).toFixed(1) + '%</div>';
            if (balance > 0) {
                html += '<div class="result-detail">✓ Portfolio should last ' + years + '+ years</div>';
                html += '<div class="result-detail">Remaining Balance: $' + balance.toFixed(0).toLocaleString() + '</div>';
            } else {
                html += '<div class="result-detail">⚠️ Portfolio depletes in ~' + yearsUntilDepletion + ' years</div>';
            }
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

console.log(`\n✅ Generated ${count} retirement planning calculators`);
console.log('📝 High search volume: Early retirement, Social Security, RMD, annuity');
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
