#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Additional high-CPC insurance calculators
const calculators = [
  {
    slug: 'travel-insurance-calculator',
    title: 'Travel Insurance Calculator',
    desc: 'Calculate travel insurance costs for trips, cruises, and international travel.',
    category: 'Travel Insurance',
    inputs: [
      { id: 'trip-cost', label: 'Total Trip Cost ($)', type: 'number', min: 0, default: 5000 },
      { id: 'destination', label: 'Destination', type: 'select', options: ['Domestic US', 'Canada/Mexico', 'Europe', 'Asia', 'South America', 'Africa/Middle East'] },
      { id: 'travelers', label: 'Number of Travelers', type: 'number', min: 1, max: 10, default: 2 },
      { id: 'duration', label: 'Trip Duration (days)', type: 'number', min: 1, max: 365, default: 7 },
      { id: 'coverage-level', label: 'Coverage Level', type: 'select', options: ['Basic', 'Standard', 'Premium', 'Cancel for Any Reason'] },
      { id: 'avg-age', label: 'Average Traveler Age', type: 'number', min: 0, max: 100, default: 45 },
    ]
  },
  {
    slug: 'business-insurance-calculator',
    title: 'Business Insurance Calculator',
    desc: 'Estimate business liability, property, and general liability insurance costs.',
    category: 'Business Insurance',
    inputs: [
      { id: 'business-type', label: 'Business Type', type: 'select', options: ['Retail', 'Restaurant', 'Office/Professional', 'Manufacturing', 'Construction', 'Service/Consulting'] },
      { id: 'revenue', label: 'Annual Revenue ($)', type: 'number', min: 0, default: 500000 },
      { id: 'employees', label: 'Number of Employees', type: 'number', min: 0, max: 1000, default: 5 },
      { id: 'property-value', label: 'Property/Equipment Value ($)', type: 'number', min: 0, default: 100000 },
      { id: 'coverage-limit', label: 'Liability Coverage Limit', type: 'select', options: ['$1 Million', '$2 Million', '$5 Million', '$10 Million'] },
    ]
  },
  {
    slug: 'flood-insurance-calculator',
    title: 'Flood Insurance Calculator',
    desc: 'Calculate NFIP flood insurance premiums for your home or business.',
    category: 'Flood Insurance',
    inputs: [
      { id: 'property-value', label: 'Property Value ($)', type: 'number', min: 0, default: 300000 },
      { id: 'contents-value', label: 'Contents Value ($)', type: 'number', min: 0, default: 50000 },
      { id: 'flood-zone', label: 'Flood Zone', type: 'select', options: ['Low Risk (X)', 'Moderate Risk (B/C)', 'High Risk (A/V)', 'Coastal High Risk (V)'] },
      { id: 'elevation', label: 'Elevation vs Base Flood', type: 'select', options: ['Above BFE', 'At BFE', '1 ft below', '2+ ft below'] },
      { id: 'building-type', label: 'Building Type', type: 'select', options: ['Single Family', 'Condo', 'Apartment', 'Commercial'] },
    ]
  },
  {
    slug: 'earthquake-insurance-calculator',
    title: 'Earthquake Insurance Calculator',
    desc: 'Estimate earthquake insurance costs based on location and home value.',
    category: 'Earthquake Insurance',
    inputs: [
      { id: 'home-value', label: 'Home Value ($)', type: 'number', min: 0, default: 400000 },
      { id: 'location', label: 'Location Risk', type: 'select', options: ['Low Risk', 'Moderate Risk', 'High Risk (CA, AK, WA)', 'Very High Risk'] },
      { id: 'construction', label: 'Construction Type', type: 'select', options: ['Wood Frame', 'Steel Frame', 'Concrete', 'Brick/Masonry'] },
      { id: 'deductible', label: 'Deductible %', type: 'select', options: ['5%', '10%', '15%', '20%', '25%'] },
      { id: 'retrofit', label: 'Seismic Retrofit?', type: 'select', options: ['Yes', 'No'] },
    ]
  },
  {
    slug: 'long-term-care-insurance-calculator',
    title: 'Long-Term Care Insurance Calculator',
    desc: 'Calculate long-term care insurance premiums and coverage needs.',
    category: 'Long-Term Care Insurance',
    inputs: [
      { id: 'age', label: 'Your Age', type: 'number', min: 40, max: 85, default: 60 },
      { id: 'daily-benefit', label: 'Daily Benefit Amount ($)', type: 'number', min: 0, default: 150 },
      { id: 'benefit-period', label: 'Benefit Period', type: 'select', options: ['3 years', '5 years', '10 years', 'Lifetime'] },
      { id: 'elimination', label: 'Elimination Period (days)', type: 'select', options: ['30', '60', '90', '180'] },
      { id: 'inflation', label: 'Inflation Protection', type: 'select', options: ['None', '3% Simple', '3% Compound', '5% Compound'] },
      { id: 'health', label: 'Health Status', type: 'select', options: ['Excellent', 'Good', 'Fair'] },
    ]
  },
  {
    slug: 'workers-comp-calculator',
    title: 'Workers Compensation Calculator',
    desc: 'Estimate workers comp insurance costs for your business.',
    category: 'Workers Compensation',
    inputs: [
      { id: 'industry', label: 'Industry', type: 'select', options: ['Office/Clerical', 'Retail', 'Restaurant', 'Construction', 'Manufacturing', 'Healthcare'] },
      { id: 'payroll', label: 'Annual Payroll ($)', type: 'number', min: 0, default: 500000 },
      { id: 'employees', label: 'Number of Employees', type: 'number', min: 1, max: 1000, default: 10 },
      { id: 'claims-history', label: 'Claims History', type: 'select', options: ['None', '1-2 claims', '3+ claims'] },
      { id: 'state', label: 'State', type: 'select', options: ['California', 'Texas', 'Florida', 'New York', 'Other'] },
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
    <title>${calc.title} - Free ${calc.category} Estimator | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free ${calc.category.toLowerCase()} calculator with instant estimates.">
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


        </div>

        <div class="calc-box">
            <h2>${calc.category} Estimator</h2>
            ${inputsHTML}
            <button class="calc-btn" onclick="calculate()">Calculate Premium</button>
            <div class="result-box" id="result"></div>
        </div>

        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About ${calc.category}</h3>
            <p>Use this calculator to estimate your ${calc.category.toLowerCase()} costs. Actual premiums will vary by insurer.</p>
            <h3>More Insurance & Financial Tools</h3>
            <ul>
                <li><a href="index.html">CalcLeap Home - All Tools</a></li>
                <li><a href="https://calcleap.com/">SmartCalc - Financial Calculators</a></li>
                <li><a href="https://calcleap.com/">HealthCalcs - Health & Wellness</a></li>
            </ul>
        </div>

        <div class="ad-placeholder">


        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 CalcLeap. Free online tools and calculators.</p>
            <p><a href="index.html">Home</a> | <a href="https://calcleap.com/">SmartCalc</a></p>
        </div>
    </div>

    <script>
        function calculate() {
            const resultBox = document.getElementById('result');
            let monthly = 0;
            let html = '<h3>Estimated Premium</h3>';
            
            ${calc.slug === 'travel-insurance-calculator' ? `
            const tripCost = parseFloat(document.getElementById('trip-cost').value);
            const travelers = parseInt(document.getElementById('travelers').value);
            const duration = parseInt(document.getElementById('duration').value);
            const avgAge = parseInt(document.getElementById('avg-age').value);
            const coverage = document.getElementById('coverage-level').value;
            
            let rate = 0.05;
            if (coverage === 'Standard') rate = 0.07;
            else if (coverage === 'Premium') rate = 0.10;
            else if (coverage === 'Cancel for Any Reason') rate = 0.12;
            
            let cost = tripCost * rate * travelers;
            if (avgAge > 65) cost *= 1.5;
            else if (avgAge > 50) cost *= 1.2;
            if (duration > 14) cost *= 1.3;
            
            html += '<div class="result-value">$' + cost.toFixed(2) + '</div>';
            html += '<div class="result-detail">Trip Cost: $' + tripCost.toFixed(2) + '</div>';
            html += '<div class="result-detail">Travelers: ' + travelers + '</div>';
            html += '<div class="result-detail">Duration: ' + duration + ' days</div>';
            html += '<div class="result-detail">Coverage: ' + coverage + '</div>';
            ` : ''}
            
            ${calc.slug === 'business-insurance-calculator' ? `
            const revenue = parseFloat(document.getElementById('revenue').value);
            const employees = parseInt(document.getElementById('employees').value);
            const propertyValue = parseFloat(document.getElementById('property-value').value);
            
            monthly = 100 + (revenue * 0.002 / 12) + (employees * 50) + (propertyValue * 0.01 / 12);
            const annual = monthly * 12;
            
            html += '<div class="result-value">$' + monthly.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Annual Premium: $' + annual.toFixed(2) + '</div>';
            html += '<div class="result-detail">Employees: ' + employees + '</div>';
            ` : ''}
            
            ${calc.slug === 'flood-insurance-calculator' ? `
            const propertyValue = parseFloat(document.getElementById('property-value').value);
            const contentsValue = parseFloat(document.getElementById('contents-value').value);
            const zone = document.getElementById('flood-zone').value;
            
            let baseRate = 500;
            if (zone.includes('High Risk')) baseRate = 2000;
            else if (zone.includes('Moderate')) baseRate = 1000;
            
            const annual = baseRate + (propertyValue * 0.002) + (contentsValue * 0.001);
            monthly = annual / 12;
            
            html += '<div class="result-value">$' + annual.toFixed(2) + '/year</div>';
            html += '<div class="result-detail">Monthly: $' + monthly.toFixed(2) + '</div>';
            html += '<div class="result-detail">Flood Zone: ' + zone + '</div>';
            ` : ''}
            
            ${calc.slug === 'earthquake-insurance-calculator' ? `
            const homeValue = parseFloat(document.getElementById('home-value').value);
            const location = document.getElementById('location').value;
            const deductible = document.getElementById('deductible').value;
            
            let rate = 0.002;
            if (location.includes('Very High')) rate = 0.015;
            else if (location.includes('High Risk')) rate = 0.010;
            else if (location.includes('Moderate')) rate = 0.005;
            
            const annual = homeValue * rate;
            monthly = annual / 12;
            const deductibleAmount = homeValue * (parseInt(deductible) / 100);
            
            html += '<div class="result-value">$' + annual.toFixed(2) + '/year</div>';
            html += '<div class="result-detail">Monthly: $' + monthly.toFixed(2) + '</div>';
            html += '<div class="result-detail">Deductible Amount: $' + deductibleAmount.toLocaleString() + '</div>';
            ` : ''}
            
            ${calc.slug === 'long-term-care-insurance-calculator' ? `
            const age = parseInt(document.getElementById('age').value);
            const dailyBenefit = parseFloat(document.getElementById('daily-benefit').value);
            const inflation = document.getElementById('inflation').value;
            
            let baseRate = 100;
            if (age >= 70) baseRate = 400;
            else if (age >= 65) baseRate = 250;
            else if (age >= 60) baseRate = 150;
            
            monthly = baseRate + (dailyBenefit * 0.5);
            if (inflation.includes('Compound')) monthly *= 1.5;
            else if (inflation.includes('Simple')) monthly *= 1.2;
            
            const annual = monthly * 12;
            html += '<div class="result-value">$' + monthly.toFixed(2) + '/month</div>';
            html += '<div class="result-detail">Annual Premium: $' + annual.toFixed(2) + '</div>';
            html += '<div class="result-detail">Daily Benefit: $' + dailyBenefit.toFixed(2) + '</div>';
            ` : ''}
            
            ${calc.slug === 'workers-comp-calculator' ? `
            const payroll = parseFloat(document.getElementById('payroll').value);
            const industry = document.getElementById('industry').value;
            const employees = parseInt(document.getElementById('employees').value);
            
            let rate = 0.01;
            if (industry === 'Construction') rate = 0.08;
            else if (industry === 'Manufacturing') rate = 0.05;
            else if (industry === 'Restaurant') rate = 0.03;
            else if (industry === 'Healthcare') rate = 0.04;
            
            const annual = payroll * rate;
            monthly = annual / 12;
            
            html += '<div class="result-value">$' + annual.toFixed(2) + '/year</div>';
            html += '<div class="result-detail">Monthly: $' + monthly.toFixed(2) + '</div>';
            html += '<div class="result-detail">Rate per $100 payroll: $' + (rate * 100).toFixed(2) + '</div>';
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

console.log(`\n✅ Generated ${count} additional high-CPC insurance calculators`);
console.log('💰 HIGH CPC: Travel ($20-35), Business ($30-50), LTC ($40-70), Workers Comp ($25-45)');
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
