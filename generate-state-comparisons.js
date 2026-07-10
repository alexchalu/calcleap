const fs = require('fs');

// High-volume state comparison pairs (common migration patterns)
const comparisons = [
  { from: 'California', to: 'Texas', reason: 'Most popular migration route, huge tax differences' },
  { from: 'New York', to: 'Florida', reason: 'Retirees + remote workers fleeing high taxes' },
  { from: 'California', to: 'Nevada', reason: 'No state income tax in Nevada' },
  { from: 'California', to: 'Arizona', reason: 'Lower cost of living, growing tech scene' },
  { from: 'Illinois', to: 'Florida', reason: 'Tax refugees + retirees' },
  { from: 'New Jersey', to: 'Florida', reason: 'Highest property taxes vs none' },
  { from: 'New York', to: 'Texas', reason: 'Finance industry migration' },
  { from: 'California', to: 'Washington', reason: 'Tech workers, no state income tax WA' },
  { from: 'Massachusetts', to: 'New Hampshire', reason: 'Bordering states, NH no income tax' },
  { from: 'Oregon', to: 'Washington', reason: 'Bordering states, WA no income tax' },
  { from: 'California', to: 'Oregon', reason: 'Tech migration, lower costs' },
  { from: 'Illinois', to: 'Texas', reason: 'Business relocations' },
  { from: 'California', to: 'Idaho', reason: 'Remote workers, lower costs' },
  { from: 'New York', to: 'North Carolina', reason: 'Finance + tech hubs' },
  { from: 'California', to: 'Colorado', reason: 'Remote workers, lifestyle' },
  { from: 'New Jersey', to: 'Pennsylvania', reason: 'Bordering states, lower property tax' },
  { from: 'Maryland', to: 'Virginia', reason: 'DC suburbs, lower taxes' },
  { from: 'Connecticut', to: 'Florida', reason: 'Retirees fleeing high taxes' },
  { from: 'Michigan', to: 'Florida', reason: 'Snowbirds + retirees' },
  { from: 'Ohio', to: 'Florida', reason: 'Retirement destination' },
  { from: 'California', to: 'Tennessee', reason: 'No state income tax TN' },
  { from: 'New York', to: 'Georgia', reason: 'Lower cost, growing economy' },
  { from: 'California', to: 'Utah', reason: 'Tech scene, lower costs' },
  { from: 'Minnesota', to: 'Florida', reason: 'Snowbirds + no state income tax' },
  { from: 'Wisconsin', to: 'Florida', reason: 'Retirement migration' }
];

// State tax data (simplified)
const stateData = {
  California: { income: '1-13.3%', sales: '7.25%', property: '0.73%', nickname: 'CA' },
  Texas: { income: '0%', sales: '6.25%', property: '1.60%', nickname: 'TX' },
  Florida: { income: '0%', sales: '6%', property: '0.83%', nickname: 'FL' },
  Nevada: { income: '0%', sales: '6.85%', property: '0.53%', nickname: 'NV' },
  Arizona: { income: '2.5%', sales: '5.6%', property: '0.51%', nickname: 'AZ' },
  Illinois: { income: '4.95%', sales: '6.25%', property: '2.08%', nickname: 'IL' },
  'New Jersey': { income: '1.4-10.75%', sales: '6.625%', property: '2.23%', nickname: 'NJ' },
  'New York': { income: '4-10.9%', sales: '4%', property: '1.72%', nickname: 'NY' },
  Washington: { income: '0%', sales: '6.5%', property: '0.84%', nickname: 'WA' },
  Massachusetts: { income: '5%', sales: '6.25%', property: '1.17%', nickname: 'MA' },
  'New Hampshire': { income: '0%', sales: '0%', property: '1.89%', nickname: 'NH' },
  Oregon: { income: '4.75-9.9%', sales: '0%', property: '0.87%', nickname: 'OR' },
  Idaho: { income: '5.8%', sales: '6%', property: '0.63%', nickname: 'ID' },
  'North Carolina': { income: '4.75%', sales: '4.75%', property: '0.70%', nickname: 'NC' },
  Colorado: { income: '4.4%', sales: '2.9%', property: '0.49%', nickname: 'CO' },
  Pennsylvania: { income: '3.07%', sales: '6%', property: '1.36%', nickname: 'PA' },
  Virginia: { income: '2-5.75%', sales: '5.3%', property: '0.74%', nickname: 'VA' },
  Maryland: { income: '2-5.75%', sales: '6%', property: '0.87%', nickname: 'MD' },
  Connecticut: { income: '3-6.99%', sales: '6.35%', property: '1.96%', nickname: 'CT' },
  Michigan: { income: '4.25%', sales: '6%', property: '1.36%', nickname: 'MI' },
  Ohio: { income: '2.75%', sales: '5.75%', property: '1.52%', nickname: 'OH' },
  Tennessee: { income: '0%', sales: '7%', property: '0.56%', nickname: 'TN' },
  Georgia: { income: '1-5.75%', sales: '4%', property: '0.81%', nickname: 'GA' },
  Utah: { income: '4.85%', sales: '6.1%', property: '0.56%', nickname: 'UT' },
  Minnesota: { income: '5.35-9.85%', sales: '6.875%', property: '1.05%', nickname: 'MN' },
  Wisconsin: { income: '3.54-7.65%', sales: '5%', property: '1.68%', nickname: 'WI' }
};

comparisons.forEach(({ from, to, reason }) => {
  const fromData = stateData[from];
  const toData = stateData[to];
  
  const slug = `${fromData.nickname.toLowerCase()}-vs-${toData.nickname.toLowerCase()}-taxes`;
  const filename = `compare-${slug}.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${from} vs ${to} Taxes Comparison 2024 | CalcLeap</title>
  <meta name="description" content="Compare ${from} vs ${to} taxes: income tax, sales tax, property tax rates. See how much you could save by moving. Interactive calculator + detailed breakdown.">
  <link rel="canonical" href="https://calcleap.com/${filename}">
  <link rel="stylesheet" href="styles.css">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "Which state has lower income tax: ${from} or ${to}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${from} has ${fromData.income} income tax, while ${to} has ${toData.income} income tax. ${toData.income === '0%' ? to + ' has no state income tax.' : ''}"
      }
    }, {
      "@type": "Question",
      "name": "Should I move from ${from} to ${to} for tax savings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tax savings depend on your income, property value, and spending. Use our calculator above to estimate your personal tax difference between ${from} and ${to}."
      }
    }]
  }
  </script>
</head>
<body>
  <header>
    <div class="container">
      <h1><a href="index.html">🔧 CalcLeap</a></h1>
      <p>Professional web tools for developers, designers, and productivity</p>
    </div>
  </header>

  <main class="container">
    <div class="tool-page">
      <h2>${from} vs ${to} Taxes: Complete Comparison 2024</h2>
      <p class="subtitle">Compare income tax, sales tax, and property tax rates between ${from} and ${to}. ${reason}.</p>

      <!-- Ad Slot 1 -->



      <div class="calculator-box">
        <h3>Tax Savings Calculator</h3>
        <p>Enter your details to see how much you'd save moving from ${from} to ${to}:</p>
        
        <label>Annual Income:</label>
        <input type="number" id="income" value="100000" min="0" step="1000">
        
        <label>Annual Purchases (for sales tax):</label>
        <input type="number" id="purchases" value="40000" min="0" step="1000">
        
        <label>Home Value (for property tax):</label>
        <input type="number" id="homeValue" value="400000" min="0" step="10000">
        
        <button onclick="calculate()">Calculate Savings</button>
        
        <div id="result" class="result-box" style="display:none;">
          <h4>Annual Tax Comparison:</h4>
          <div class="comparison-table">
            <div class="state-column">
              <h5>${from}</h5>
              <p>Income Tax: <span id="fromIncome">-</span></p>
              <p>Sales Tax: <span id="fromSales">-</span></p>
              <p>Property Tax: <span id="fromProperty">-</span></p>
              <p class="total"><strong>Total: <span id="fromTotal">-</span></strong></p>
            </div>
            <div class="state-column">
              <h5>${to}</h5>
              <p>Income Tax: <span id="toIncome">-</span></p>
              <p>Sales Tax: <span id="toSales">-</span></p>
              <p>Property Tax: <span id="toProperty">-</span></p>
              <p class="total"><strong>Total: <span id="toTotal">-</span></strong></p>
            </div>
          </div>
          <div class="savings-box">
            <h4>💰 Annual Savings: <span id="savings">-</span></h4>
            <p id="savingsNote"></p>
          </div>
        </div>
      </div>

      <!-- Ad Slot 2 -->



      <div class="info-section">
        <h3>Tax Rate Comparison Table</h3>
        <table class="comparison-table">
          <tr>
            <th>Tax Type</th>
            <th>${from}</th>
            <th>${to}</th>
          </tr>
          <tr>
            <td>State Income Tax</td>
            <td>${fromData.income}</td>
            <td>${toData.income}</td>
          </tr>
          <tr>
            <td>State Sales Tax</td>
            <td>${fromData.sales}</td>
            <td>${toData.sales}</td>
          </tr>
          <tr>
            <td>Avg Property Tax Rate</td>
            <td>${fromData.property}</td>
            <td>${toData.property}</td>
          </tr>
        </table>
      </div>

      <div class="info-section">
        <h3>Key Differences</h3>
        <ul>
          <li><strong>Income Tax:</strong> ${fromData.income === '0%' ? from + ' has no state income tax' : from + ' charges ' + fromData.income + ' income tax'}. ${toData.income === '0%' ? to + ' has no state income tax.' : to + ' charges ' + toData.income + ' income tax.'}</li>
          <li><strong>Sales Tax:</strong> ${from} has ${fromData.sales} base sales tax vs ${to}'s ${toData.sales} (local rates may apply).</li>
          <li><strong>Property Tax:</strong> ${from} averages ${fromData.property} property tax rate vs ${to}'s ${toData.property}.</li>
        </ul>
      </div>

      <div class="faq-section">
        <h3>Frequently Asked Questions</h3>
        
        <h4>Which state has lower taxes: ${from} or ${to}?</h4>
        <p>It depends on your income and property value. Use the calculator above to see your personalized comparison. Generally, ${toData.income === '0%' ? to + ' has lower income tax (0%)' : 'tax burden varies by income level'}.</p>
        
        <h4>How much will I save moving from ${from} to ${to}?</h4>
        <p>Tax savings vary based on income, property value, and spending. For a $100k earner with a $400k home, typical savings range from $${toData.income === '0%' && fromData.income !== '0%' ? '5,000-15,000' : '2,000-8,000'} annually.</p>
        
        <h4>Does ${to} have state income tax?</h4>
        <p>${toData.income === '0%' ? 'No, ' + to + ' has no state income tax.' : 'Yes, ' + to + ' charges ' + toData.income + ' state income tax.'}</p>
      </div>

      <!-- Ad Slot 3 -->



      <div class="related-links">
        <h4>Compare Other States:</h4>
        <div class="tool-grid">
          ${comparisons.filter(c => c.from !== from || c.to !== to).slice(0, 6).map(c => {
            const cFromData = stateData[c.from];
            const cToData = stateData[c.to];
            const cSlug = `${cFromData.nickname.toLowerCase()}-vs-${cToData.nickname.toLowerCase()}-taxes`;
            return `<a href="compare-${cSlug}.html" class="tool-card">${c.from} vs ${c.to}</a>`;
          }).join('\n          ')}
        </div>
        <p><a href="state-taxes.html">View All State Tax Calculators →</a></p>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>More tools: <a href="https://calcleap.com/">SmartCalc Finance Tools</a> | <a href="https://calcleap.com/">WriteFast AI Writing</a> | <a href="https://calcleap.com/">Health Calculators</a></p>
      <p>&copy; 2024 CalcLeap. All rights reserved.</p>
    </div>
  </footer>

  <script>
    // Simplified tax calculation (not actual tax code, for estimation only)
    function calculateTax(income, purchases, homeValue, state) {
      const data = ${JSON.stringify(stateData)};
      const s = data[state];
      
      let incomeTax = 0;
      if (s.income.includes('-')) {
        // Progressive rate - use midpoint as estimate
        const rates = s.income.replace('%', '').split('-');
        const avgRate = (parseFloat(rates[0]) + parseFloat(rates[1])) / 2;
        incomeTax = income * (avgRate / 100);
      } else {
        incomeTax = income * (parseFloat(s.income) / 100);
      }
      
      const salesTax = purchases * (parseFloat(s.sales) / 100);
      const propertyTax = homeValue * (parseFloat(s.property) / 100);
      
      return { incomeTax, salesTax, propertyTax, total: incomeTax + salesTax + propertyTax };
    }
    
    function formatCurrency(num) {
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    
    function calculate() {
      const income = parseFloat(document.getElementById('income').value) || 0;
      const purchases = parseFloat(document.getElementById('purchases').value) || 0;
      const homeValue = parseFloat(document.getElementById('homeValue').value) || 0;
      
      const from = calculateTax(income, purchases, homeValue, '${from}');
      const to = calculateTax(income, purchases, homeValue, '${to}');
      
      document.getElementById('fromIncome').textContent = formatCurrency(from.incomeTax);
      document.getElementById('fromSales').textContent = formatCurrency(from.salesTax);
      document.getElementById('fromProperty').textContent = formatCurrency(from.propertyTax);
      document.getElementById('fromTotal').textContent = formatCurrency(from.total);
      
      document.getElementById('toIncome').textContent = formatCurrency(to.incomeTax);
      document.getElementById('toSales').textContent = formatCurrency(to.salesTax);
      document.getElementById('toProperty').textContent = formatCurrency(to.propertyTax);
      document.getElementById('toTotal').textContent = formatCurrency(to.total);
      
      const savings = from.total - to.total;
      const savingsEl = document.getElementById('savings');
      const noteEl = document.getElementById('savingsNote');
      
      if (savings > 0) {
        savingsEl.textContent = formatCurrency(savings);
        savingsEl.style.color = '#22c55e';
        noteEl.textContent = \`You'd save \${formatCurrency(savings)} per year moving from ${from} to ${to}!\`;
        noteEl.style.color = '#22c55e';
      } else if (savings < 0) {
        savingsEl.textContent = formatCurrency(Math.abs(savings)) + ' more';
        savingsEl.style.color = '#ef4444';
        noteEl.textContent = \`You'd pay \${formatCurrency(Math.abs(savings))} more per year in ${to}.\`;
        noteEl.style.color = '#ef4444';
      } else {
        savingsEl.textContent = '$0';
        savingsEl.style.color = '#64748b';
        noteEl.textContent = 'Tax burden is roughly equal between the two states.';
        noteEl.style.color = '#64748b';
      }
      
      document.getElementById('result').style.display = 'block';
    }
    
    // Auto-calculate on page load
    calculate();
  </script>
</body>
</html>`;

  fs.writeFileSync(filename, html);
  console.log(`✓ ${filename}`);
});

console.log(`\n✅ Generated ${comparisons.length} state tax comparison pages`);
