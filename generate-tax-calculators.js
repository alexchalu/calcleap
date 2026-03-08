#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const taxCalculators = [
  {
    id: 'federal-income-tax',
    name: 'Federal Income Tax Calculator',
    desc: 'Calculate your federal income tax based on 2024 tax brackets',
    category: 'Finance',
    keywords: 'federal income tax calculator, tax bracket calculator, income tax estimator',
    fields: [
      { id: 'income', label: 'Annual Income ($)', type: 'number', placeholder: '75000' },
      { id: 'filingStatus', label: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] },
      { id: 'deductions', label: 'Total Deductions ($)', type: 'number', placeholder: '13850' }
    ],
    calculate: `
      const income = parseFloat(document.getElementById('income').value) || 0;
      const deductions = parseFloat(document.getElementById('deductions').value) || 0;
      const filingStatus = document.getElementById('filingStatus').value;
      
      const taxableIncome = Math.max(0, income - deductions);
      
      // 2024 tax brackets (simplified)
      const brackets = {
        'Single': [
          { limit: 11600, rate: 0.10 },
          { limit: 47150, rate: 0.12 },
          { limit: 100525, rate: 0.22 },
          { limit: 191950, rate: 0.24 },
          { limit: 243725, rate: 0.32 },
          { limit: 609350, rate: 0.35 },
          { limit: Infinity, rate: 0.37 }
        ],
        'Married Filing Jointly': [
          { limit: 23200, rate: 0.10 },
          { limit: 94300, rate: 0.12 },
          { limit: 201050, rate: 0.22 },
          { limit: 383900, rate: 0.24 },
          { limit: 487450, rate: 0.32 },
          { limit: 731200, rate: 0.35 },
          { limit: Infinity, rate: 0.37 }
        ]
      };
      
      const bracketList = brackets[filingStatus] || brackets['Single'];
      let tax = 0;
      let remaining = taxableIncome;
      let prevLimit = 0;
      
      for (const bracket of bracketList) {
        const amountInBracket = Math.min(remaining, bracket.limit - prevLimit);
        tax += amountInBracket * bracket.rate;
        remaining -= amountInBracket;
        prevLimit = bracket.limit;
        if (remaining <= 0) break;
      }
      
      const effectiveRate = (tax / income * 100).toFixed(2);
      
      document.getElementById('result').innerHTML = 
        '<div class="result-card">' +
        '<h3>Tax Results</h3>' +
        '<p><strong>Taxable Income:</strong> $' + taxableIncome.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p><strong>Federal Tax Owed:</strong> <span class="highlight">$' + tax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</span></p>' +
        '<p><strong>Effective Tax Rate:</strong> ' + effectiveRate + '%</p>' +
        '<p><strong>After-Tax Income:</strong> $' + (income - tax).toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '</div>';
    `
  },
  {
    id: 'quarterly-tax',
    name: 'Quarterly Tax Calculator',
    desc: 'Calculate estimated quarterly tax payments for self-employed individuals',
    category: 'Finance',
    keywords: 'quarterly tax calculator, estimated tax payments, self-employed tax',
    fields: [
      { id: 'annualIncome', label: 'Expected Annual Income ($)', type: 'number', placeholder: '80000' },
      { id: 'expenses', label: 'Business Expenses ($)', type: 'number', placeholder: '15000' },
      { id: 'selfEmploymentTax', label: 'Include Self-Employment Tax', type: 'checkbox', checked: true }
    ],
    calculate: `
      const income = parseFloat(document.getElementById('annualIncome').value) || 0;
      const expenses = parseFloat(document.getElementById('expenses').value) || 0;
      const includeSE = document.getElementById('selfEmploymentTax').checked;
      
      const netIncome = income - expenses;
      const standardDeduction = 13850;
      const taxableIncome = Math.max(0, netIncome - standardDeduction);
      
      // Simplified federal tax (22% bracket for typical self-employed)
      const federalTax = taxableIncome * 0.22;
      
      // Self-employment tax (15.3% of net income)
      const seTax = includeSE ? netIncome * 0.153 : 0;
      
      const totalAnnualTax = federalTax + seTax;
      const quarterlyPayment = totalAnnualTax / 4;
      
      document.getElementById('result').innerHTML = 
        '<div class="result-card">' +
        '<h3>Quarterly Tax Estimate</h3>' +
        '<p><strong>Net Business Income:</strong> $' + netIncome.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p><strong>Federal Income Tax:</strong> $' + federalTax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        (includeSE ? '<p><strong>Self-Employment Tax:</strong> $' + seTax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' : '') +
        '<p><strong>Total Annual Tax:</strong> $' + totalAnnualTax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p class="highlight"><strong>Quarterly Payment:</strong> $' + quarterlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p style="font-size: 0.9em; color: #666;">Due dates: Apr 15, Jun 15, Sep 15, Jan 15</p>' +
        '</div>';
    `
  },
  {
    id: 'capital-gains-tax',
    name: 'Capital Gains Tax Calculator',
    desc: 'Calculate tax on investment profits and stock sales',
    category: 'Finance',
    keywords: 'capital gains tax calculator, stock profit tax, investment tax calculator',
    fields: [
      { id: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', placeholder: '10000' },
      { id: 'salePrice', label: 'Sale Price ($)', type: 'number', placeholder: '15000' },
      { id: 'holdingPeriod', label: 'Holding Period', type: 'select', options: ['Short-term (< 1 year)', 'Long-term (> 1 year)'] },
      { id: 'income', label: 'Annual Income ($)', type: 'number', placeholder: '80000' }
    ],
    calculate: `
      const purchase = parseFloat(document.getElementById('purchasePrice').value) || 0;
      const sale = parseFloat(document.getElementById('salePrice').value) || 0;
      const holding = document.getElementById('holdingPeriod').value;
      const income = parseFloat(document.getElementById('income').value) || 0;
      
      const gain = sale - purchase;
      
      let taxRate;
      if (holding.includes('Short-term')) {
        // Short-term = ordinary income tax (simplified to 22% bracket)
        taxRate = 0.22;
      } else {
        // Long-term rates based on income
        if (income <= 44625) taxRate = 0;
        else if (income <= 492300) taxRate = 0.15;
        else taxRate = 0.20;
      }
      
      const tax = gain * taxRate;
      const netGain = gain - tax;
      
      document.getElementById('result').innerHTML = 
        '<div class="result-card">' +
        '<h3>Capital Gains Tax</h3>' +
        '<p><strong>Capital Gain:</strong> $' + gain.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p><strong>Tax Rate:</strong> ' + (taxRate * 100) + '%</p>' +
        '<p><strong>Tax Owed:</strong> <span class="highlight">$' + tax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</span></p>' +
        '<p><strong>Net Profit After Tax:</strong> $' + netGain.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p style="font-size: 0.9em; color: #666;">Note: ' + holding + '</p>' +
        '</div>';
    `
  },
  {
    id: 'sales-tax',
    name: 'Sales Tax Calculator',
    desc: 'Calculate sales tax and total price for purchases',
    category: 'Finance',
    keywords: 'sales tax calculator, tax on purchase, total price calculator',
    fields: [
      { id: 'price', label: 'Item Price ($)', type: 'number', placeholder: '100' },
      { id: 'taxRate', label: 'Sales Tax Rate (%)', type: 'number', placeholder: '7.5', step: '0.1' }
    ],
    calculate: `
      const price = parseFloat(document.getElementById('price').value) || 0;
      const rate = parseFloat(document.getElementById('taxRate').value) || 0;
      
      const tax = price * (rate / 100);
      const total = price + tax;
      
      document.getElementById('result').innerHTML = 
        '<div class="result-card">' +
        '<h3>Sales Tax Breakdown</h3>' +
        '<p><strong>Subtotal:</strong> $' + price.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p><strong>Sales Tax (' + rate + '%):</strong> $' + tax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p class="highlight"><strong>Total Price:</strong> $' + total.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '</div>';
    `
  },
  {
    id: 'property-tax',
    name: 'Property Tax Calculator',
    desc: 'Estimate annual property tax based on home value and local tax rate',
    category: 'Finance',
    keywords: 'property tax calculator, home tax estimator, real estate tax',
    fields: [
      { id: 'homeValue', label: 'Home Value ($)', type: 'number', placeholder: '350000' },
      { id: 'taxRate', label: 'Property Tax Rate (%)', type: 'number', placeholder: '1.2', step: '0.01' },
      { id: 'assessmentRatio', label: 'Assessment Ratio (%)', type: 'number', placeholder: '100', step: '1' }
    ],
    calculate: `
      const value = parseFloat(document.getElementById('homeValue').value) || 0;
      const rate = parseFloat(document.getElementById('taxRate').value) || 0;
      const ratio = parseFloat(document.getElementById('assessmentRatio').value) || 100;
      
      const assessedValue = value * (ratio / 100);
      const annualTax = assessedValue * (rate / 100);
      const monthlyTax = annualTax / 12;
      
      document.getElementById('result').innerHTML = 
        '<div class="result-card">' +
        '<h3>Property Tax Estimate</h3>' +
        '<p><strong>Home Value:</strong> $' + value.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p><strong>Assessed Value (' + ratio + '%):</strong> $' + assessedValue.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p class="highlight"><strong>Annual Property Tax:</strong> $' + annualTax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '<p><strong>Monthly (in escrow):</strong> $' + monthlyTax.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</p>' +
        '</div>';
    `
  }
];

const template = (calc) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.name} - Free Online Tax Calculator | ToolPulse</title>
    <meta name="description" content="${calc.desc}. Fast, accurate, and completely free. No signup required.">
    <meta name="keywords" content="${calc.keywords}">
    <link rel="canonical" href="https://alexchalu.github.io/toolpulse/${calc.id}.html">
    <link rel="stylesheet" href="styles.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="index.html">🛠️ ToolPulse</a></h1>
            <p>Free tools for developers and creators</p>
        </div>
    </header>

    <main class="container">
        <!-- Ad Slot 1 -->
        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="tool-container">
            <h2>${calc.name}</h2>
            <p class="tool-description">${calc.desc}</p>

            <div class="tool-form">
                ${calc.fields.map(field => {
                  if (field.type === 'select') {
                    return `
                <div class="form-group">
                    <label for="${field.id}">${field.label}</label>
                    <select id="${field.id}" class="form-control">
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>`;
                  } else if (field.type === 'checkbox') {
                    return `
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="${field.id}" ${field.checked ? 'checked' : ''}> ${field.label}
                    </label>
                </div>`;
                  } else {
                    return `
                <div class="form-group">
                    <label for="${field.id}">${field.label}</label>
                    <input type="${field.type}" id="${field.id}" class="form-control" placeholder="${field.placeholder || ''}" ${field.step ? `step="${field.step}"` : ''}>
                </div>`;
                  }
                }).join('')}

                <button onclick="calculate()" class="btn-primary">Calculate</button>
                <button onclick="clearForm()" class="btn-secondary">Clear</button>
            </div>

            <div id="result" class="result-container"></div>
        </div>

        <!-- Ad Slot 2 -->
        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="9876543210" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-section">
            <h3>About This Calculator</h3>
            <p>${calc.desc}. This tool provides quick estimates for tax planning purposes. Always consult a tax professional for specific advice.</p>
            
            <h4>Related Tools</h4>
            <ul class="related-tools">
                <li><a href="index.html">All ToolPulse Tools</a></li>
                <li><a href="https://alexchalu.github.io/smartcalc/">SmartCalc Financial Calculators</a></li>
                <li><a href="https://alexchalu.github.io/healthcalcs/">HealthCalcs Wellness Tools</a></li>
            </ul>
        </div>

        <!-- Ad Slot 3 -->
        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1357924680" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ToolPulse | <a href="privacy.html">Privacy</a> | <a href="terms.html">Terms</a></p>
        </div>
    </footer>

    <script>
        function calculate() {
            ${calc.calculate}
        }

        function clearForm() {
            document.querySelectorAll('input, select').forEach(el => {
                if (el.type === 'checkbox') el.checked = false;
                else el.value = '';
            });
            document.getElementById('result').innerHTML = '';
        }
    </script>
</body>
</html>`;

// Generate all tax calculator pages
taxCalculators.forEach(calc => {
  const filename = path.join(__dirname, `${calc.id}.html`);
  fs.writeFileSync(filename, template(calc));
  console.log(`✅ Created ${calc.id}.html`);
});

console.log(`\n✅ Generated ${taxCalculators.length} tax calculator pages`);
console.log('Next: Update index.html and sitemap.xml, then push to GitHub');
