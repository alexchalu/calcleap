#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-CPC insurance & finance calculators
const calculators = [
  {
    slug: 'travel-insurance-calculator',
    title: 'Travel Insurance Cost Calculator',
    desc: 'Estimate travel insurance premiums for trips, vacations, and international travel',
    category: 'Travel Insurance',
    cpc: '$20-35/click',
    inputs: [
      { id: 'trip-cost', label: 'Trip Cost ($)', type: 'number', min: 0, default: 3000 },
      { id: 'travelers', label: 'Number of Travelers', type: 'number', min: 1, max: 10, default: 2 },
      { id: 'age', label: 'Oldest Traveler Age', type: 'number', min: 18, max: 100, default: 40 },
      { id: 'duration', label: 'Trip Duration (days)', type: 'number', min: 1, max: 365, default: 7 },
      { id: 'destination', label: 'Destination Type', type: 'select', options: ['Domestic', 'International', 'Adventure/High-Risk'] },
      { id: 'coverage', label: 'Coverage Level', type: 'select', options: ['Basic', 'Standard', 'Comprehensive'] },
    ]
  },
  {
    slug: 'business-insurance-calculator',
    title: 'Business Insurance Cost Calculator',
    desc: 'Calculate small business insurance premiums including liability, property, and workers comp',
    category: 'Business Insurance',
    cpc: '$30-50/click',
    inputs: [
      { id: 'business-type', label: 'Business Type', type: 'select', options: ['Retail', 'Office/Professional', 'Restaurant', 'Construction', 'Manufacturing', 'Service'] },
      { id: 'revenue', label: 'Annual Revenue ($)', type: 'number', min: 0, default: 500000 },
      { id: 'employees', label: 'Number of Employees', type: 'number', min: 0, max: 500, default: 5 },
      { id: 'property-value', label: 'Property/Equipment Value ($)', type: 'number', min: 0, default: 100000 },
      { id: 'coverage-types', label: 'Coverage Needed', type: 'select', options: ['Liability Only', 'Liability + Property', 'Full Package (incl. Workers Comp)'] },
    ]
  },
  {
    slug: 'long-term-care-insurance-calculator',
    title: 'Long-Term Care Insurance Calculator',
    desc: 'Estimate long-term care insurance costs for nursing home and in-home care coverage',
    category: 'Long-Term Care Insurance',
    cpc: '$40-70/click',
    inputs: [
      { id: 'age', label: 'Your Age', type: 'number', min: 40, max: 85, default: 55 },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
      { id: 'benefit-amount', label: 'Daily Benefit Amount ($)', type: 'number', min: 0, default: 150 },
      { id: 'benefit-period', label: 'Benefit Period', type: 'select', options: ['2 years', '3 years', '5 years', 'Lifetime'] },
      { id: 'waiting-period', label: 'Waiting Period', type: 'select', options: ['30 days', '60 days', '90 days', '180 days'] },
      { id: 'inflation', label: 'Inflation Protection', type: 'select', options: ['None', '3% Simple', '3% Compound', '5% Compound'] },
    ]
  },
  {
    slug: 'flood-insurance-calculator',
    title: 'Flood Insurance Cost Calculator',
    desc: 'Calculate flood insurance premiums based on flood zone and property value',
    category: 'Flood Insurance',
    cpc: '$25-40/click',
    inputs: [
      { id: 'home-value', label: 'Home Value ($)', type: 'number', min: 0, default: 300000 },
      { id: 'flood-zone', label: 'Flood Zone', type: 'select', options: ['Zone A (High Risk)', 'Zone AE (High Risk)', 'Zone X (Moderate Risk)', 'Zone X (Low Risk)'] },
      { id: 'elevation', label: 'Elevation vs Base', type: 'select', options: ['Below Base Flood', 'At Base Flood', 'Above Base Flood'] },
      { id: 'building-coverage', label: 'Building Coverage ($)', type: 'number', min: 0, default: 250000 },
      { id: 'contents-coverage', label: 'Contents Coverage ($)', type: 'number', min: 0, default: 100000 },
    ]
  },
  {
    slug: 'mortgage-refinance-calculator',
    title: 'Mortgage Refinance Calculator',
    desc: 'Calculate if refinancing your mortgage saves money - break-even analysis',
    category: 'Mortgage Refinance',
    cpc: '$30-50/click',
    inputs: [
      { id: 'current-balance', label: 'Current Loan Balance ($)', type: 'number', min: 0, default: 250000 },
      { id: 'current-rate', label: 'Current Interest Rate (%)', type: 'number', min: 0, max: 20, step: 0.01, default: 6.5 },
      { id: 'current-term', label: 'Remaining Term (years)', type: 'number', min: 1, max: 30, default: 25 },
      { id: 'new-rate', label: 'New Interest Rate (%)', type: 'number', min: 0, max: 20, step: 0.01, default: 5.5 },
      { id: 'new-term', label: 'New Loan Term (years)', type: 'select', options: ['15', '20', '30'] },
      { id: 'closing-costs', label: 'Closing Costs ($)', type: 'number', min: 0, default: 3000 },
    ]
  },
  {
    slug: 'heloc-payment-calculator',
    title: 'HELOC Payment Calculator',
    desc: 'Calculate home equity line of credit payments and interest costs',
    category: 'Home Equity',
    cpc: '$25-45/click',
    inputs: [
      { id: 'heloc-amount', label: 'HELOC Amount ($)', type: 'number', min: 0, default: 50000 },
      { id: 'interest-rate', label: 'Interest Rate (%)', type: 'number', min: 0, max: 20, step: 0.01, default: 7.5 },
      { id: 'draw-period', label: 'Draw Period (years)', type: 'number', min: 1, max: 15, default: 10 },
      { id: 'repayment-period', label: 'Repayment Period (years)', type: 'number', min: 1, max: 20, default: 15 },
      { id: 'payment-type', label: 'Payment During Draw Period', type: 'select', options: ['Interest Only', 'Principal + Interest'] },
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
          <input type="${input.type}" id="${input.id}" ${input.placeholder ? `placeholder="${input.placeholder}"` : ''} ${input.min !== undefined ? `min="${input.min}"` : ''} ${input.max !== undefined ? `max="${input.max}"` : ''} ${input.step ? `step="${input.step}"` : ''} ${input.default !== undefined ? `value="${input.default}"` : ''}>
        </div>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free ${calc.category} Tool | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free ${calc.category.toLowerCase()} calculator. Get instant estimates and make informed decisions.">
    <link rel="canonical" href="https://calcleap.com/${calc.slug}.html">
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
        .result-box .price { font-size: 2rem; font-weight: 700; color: #667eea; margin: 0.5rem 0; }
        .result-box .detail { margin: 0.5rem 0; color: #555; }
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


        </div>

        <div class="calc-box">
            <h2>Calculate ${calc.category}</h2>
            ${inputsHTML}
            <button class="calc-btn" onclick="calculate()">Calculate Now</button>
            <div class="result-box" id="result"></div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About ${calc.category}</h3>
            <p>Use this ${calc.title.toLowerCase()} to get accurate estimates and make informed financial decisions.</p>
        </div>

        <div class="ad-placeholder">


        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 CalcLeap. Free online tools and calculators.</p>
            <p><a href="index.html">Home</a> | <a href="https://calcleap.com/">SmartCalc</a> | <a href="https://calcleap.com/">HealthCalcs</a></p>
        </div>
    </div>

    <script>
        function calculate() {
            let resultHTML = '<h3>Estimated Cost</h3>';
            
            ${calc.slug === 'travel-insurance-calculator' ? `
            const tripCost = parseFloat(document.getElementById('trip-cost').value) || 3000;
            const travelers = parseInt(document.getElementById('travelers').value) || 2;
            const age = parseInt(document.getElementById('age').value) || 40;
            const duration = parseInt(document.getElementById('duration').value) || 7;
            const destination = document.getElementById('destination').value;
            const coverage = document.getElementById('coverage').value;
            
            let cost = tripCost * 0.05;
            cost += travelers * 20;
            cost += (age - 30) * 2;
            cost += duration * 5;
            
            if (destination === 'International') cost *= 1.5;
            else if (destination === 'Adventure/High-Risk') cost *= 2.2;
            
            if (coverage === 'Standard') cost *= 1.3;
            else if (coverage === 'Comprehensive') cost *= 1.7;
            
            resultHTML += '<div class="price">$' + cost.toFixed(2) + '</div>';
            resultHTML += '<div class="detail">Total premium for ' + duration + ' day trip</div>';
            resultHTML += '<div class="detail">Coverage: ' + coverage + ' | ' + travelers + ' traveler(s)</div>';
            ` : ''}
            
            ${calc.slug === 'business-insurance-calculator' ? `
            const revenue = parseFloat(document.getElementById('revenue').value) || 500000;
            const employees = parseInt(document.getElementById('employees').value) || 5;
            const propertyValue = parseFloat(document.getElementById('property-value').value) || 100000;
            const businessType = document.getElementById('business-type').value;
            const coverageTypes = document.getElementById('coverage-types').value;
            
            let annual = revenue * 0.005;
            annual += employees * 300;
            annual += propertyValue * 0.01;
            
            if (businessType === 'Construction') annual *= 2.5;
            else if (businessType === 'Restaurant') annual *= 1.8;
            else if (businessType === 'Manufacturing') annual *= 2.0;
            
            if (coverageTypes === 'Liability + Property') annual *= 1.5;
            else if (coverageTypes === 'Full Package (incl. Workers Comp)') annual *= 2.2;
            
            const monthly = annual / 12;
            resultHTML += '<div class="price">$' + monthly.toFixed(2) + '/month</div>';
            resultHTML += '<div class="detail">Annual Premium: $' + annual.toFixed(2) + '</div>';
            resultHTML += '<div class="detail">Coverage: ' + coverageTypes + '</div>';
            ` : ''}
            
            ${calc.slug === 'long-term-care-insurance-calculator' ? `
            const age = parseInt(document.getElementById('age').value) || 55;
            const gender = document.getElementById('gender').value;
            const benefitAmount = parseFloat(document.getElementById('benefit-amount').value) || 150;
            const benefitPeriod = document.getElementById('benefit-period').value;
            const inflation = document.getElementById('inflation').value;
            
            let monthly = benefitAmount * 0.8;
            monthly += (age - 50) * 10;
            if (gender === 'Female') monthly += 20;
            
            if (benefitPeriod === '5 years') monthly *= 1.3;
            else if (benefitPeriod === 'Lifetime') monthly *= 2.0;
            
            if (inflation === '3% Compound') monthly *= 1.4;
            else if (inflation === '5% Compound') monthly *= 1.7;
            
            const annual = monthly * 12;
            resultHTML += '<div class="price">$' + monthly.toFixed(2) + '/month</div>';
            resultHTML += '<div class="detail">Annual Premium: $' + annual.toFixed(2) + '</div>';
            resultHTML += '<div class="detail">Daily Benefit: $' + benefitAmount + ' | Period: ' + benefitPeriod + '</div>';
            ` : ''}
            
            ${calc.slug === 'flood-insurance-calculator' ? `
            const homeValue = parseFloat(document.getElementById('home-value').value) || 300000;
            const floodZone = document.getElementById('flood-zone').value;
            const buildingCoverage = parseFloat(document.getElementById('building-coverage').value) || 250000;
            const contentsCoverage = parseFloat(document.getElementById('contents-coverage').value) || 100000;
            
            let annual = buildingCoverage * 0.003 + contentsCoverage * 0.002;
            
            if (floodZone.includes('Zone A')) annual *= 3.5;
            else if (floodZone.includes('Moderate Risk')) annual *= 1.5;
            
            const monthly = annual / 12;
            resultHTML += '<div class="price">$' + monthly.toFixed(2) + '/month</div>';
            resultHTML += '<div class="detail">Annual Premium: $' + annual.toFixed(2) + '</div>';
            resultHTML += '<div class="detail">Building: $' + buildingCoverage.toLocaleString() + ' | Contents: $' + contentsCoverage.toLocaleString() + '</div>';
            ` : ''}
            
            ${calc.slug === 'mortgage-refinance-calculator' ? `
            const balance = parseFloat(document.getElementById('current-balance').value) || 250000;
            const currentRate = parseFloat(document.getElementById('current-rate').value) || 6.5;
            const currentTerm = parseInt(document.getElementById('current-term').value) || 25;
            const newRate = parseFloat(document.getElementById('new-rate').value) || 5.5;
            const newTerm = parseInt(document.getElementById('new-term').value) || 30;
            const closingCosts = parseFloat(document.getElementById('closing-costs').value) || 3000;
            
            // Current payment
            const currentMonthlyRate = currentRate / 100 / 12;
            const currentPayments = currentTerm * 12;
            const currentPayment = balance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) / (Math.pow(1 + currentMonthlyRate, currentPayments) - 1);
            
            // New payment
            const newMonthlyRate = newRate / 100 / 12;
            const newPayments = newTerm * 12;
            const newPayment = balance * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newPayments)) / (Math.pow(1 + newMonthlyRate, newPayments) - 1);
            
            const monthlySavings = currentPayment - newPayment;
            const breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
            
            resultHTML += '<div class="price">$' + monthlySavings.toFixed(2) + '/month savings</div>';
            resultHTML += '<div class="detail">Current Payment: $' + currentPayment.toFixed(2) + '</div>';
            resultHTML += '<div class="detail">New Payment: $' + newPayment.toFixed(2) + '</div>';
            resultHTML += '<div class="detail">Break-even: ' + breakEvenMonths + ' months (' + (breakEvenMonths / 12).toFixed(1) + ' years)</div>';
            resultHTML += '<div class="detail" style="margin-top:1rem; color:' + (monthlySavings > 0 ? '#10b981' : '#ef4444') + ';">💡 ' + (monthlySavings > 0 ? 'Refinancing could save you money!' : 'Current rate may be better.') + '</div>';
            ` : ''}
            
            ${calc.slug === 'heloc-payment-calculator' ? `
            const helocAmount = parseFloat(document.getElementById('heloc-amount').value) || 50000;
            const interestRate = parseFloat(document.getElementById('interest-rate').value) || 7.5;
            const drawPeriod = parseInt(document.getElementById('draw-period').value) || 10;
            const repaymentPeriod = parseInt(document.getElementById('repayment-period').value) || 15;
            const paymentType = document.getElementById('payment-type').value;
            
            const monthlyRate = interestRate / 100 / 12;
            
            // Draw period payment
            let drawPayment;
            if (paymentType === 'Interest Only') {
                drawPayment = helocAmount * monthlyRate;
            } else {
                const drawPayments = drawPeriod * 12;
                drawPayment = helocAmount * (monthlyRate * Math.pow(1 + monthlyRate, drawPayments)) / (Math.pow(1 + monthlyRate, drawPayments) - 1);
            }
            
            // Repayment period payment (full principal + interest)
            const repayPayments = repaymentPeriod * 12;
            const repayPayment = helocAmount * (monthlyRate * Math.pow(1 + monthlyRate, repayPayments)) / (Math.pow(1 + monthlyRate, repayPayments) - 1);
            
            resultHTML += '<div class="price">$' + drawPayment.toFixed(2) + '/month</div>';
            resultHTML += '<div class="detail">Draw Period Payment (first ' + drawPeriod + ' years)</div>';
            resultHTML += '<div class="detail">Repayment Period: $' + repayPayment.toFixed(2) + '/month</div>';
            resultHTML += '<div class="detail">Total Interest: ~$' + ((drawPayment * drawPeriod * 12) + (repayPayment * repaymentPeriod * 12) - helocAmount).toFixed(2) + '</div>';
            ` : ''}
            
            document.getElementById('result').innerHTML = resultHTML;
            document.getElementById('result').style.display = 'block';
        }
    </script>
</body>
</html>`;
}

// Generate all pages
let count = 0;
calculators.forEach(calc => {
  const html = generateHTML(calc);
  fs.writeFileSync(path.join(__dirname, `${calc.slug}.html`), html);
  count++;
  console.log(`✓ Generated ${calc.slug}.html (${calc.cpc})`);
});

console.log(`\n✅ Generated ${count} advanced insurance & finance calculator pages`);
console.log('💰 ULTRA HIGH CPC: Long-term care ($40-70), Business insurance ($30-50), Mortgage refi ($30-50)');
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
