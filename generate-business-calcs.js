#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const calculators = [
  {
    slug: 'business-valuation-calculator',
    title: 'Business Valuation Calculator',
    desc: 'Calculate your business worth using multiple valuation methods',
    category: 'Business',
    cpc: 'High ($15-40/click)',
  },
  {
    slug: 'break-even-analysis-calculator',
    title: 'Break-Even Analysis Calculator',
    desc: 'Calculate when your business will become profitable',
    category: 'Business',
    cpc: 'Medium ($8-20/click)',
  },
  {
    slug: 'startup-cost-calculator',
    title: 'Startup Cost Calculator',
    desc: 'Estimate total costs to start your business',
    category: 'Business',
    cpc: 'High ($12-30/click)',
  },
  {
    slug: 'cash-flow-calculator',
    title: 'Cash Flow Calculator',
    desc: 'Track and forecast business cash flow',
    category: 'Business',
    cpc: 'Medium ($10-25/click)',
  },
  {
    slug: 'payroll-tax-calculator',
    title: 'Payroll Tax Calculator',
    desc: 'Calculate employer payroll taxes and withholdings',
    category: 'Business',
    cpc: 'High ($20-45/click)',
  },
  {
    slug: 'business-loan-calculator',
    title: 'Business Loan Calculator',
    desc: 'Calculate monthly payments on business loans',
    category: 'Business',
    cpc: 'Very High ($25-60/click)',
  },
  {
    slug: 'inventory-turnover-calculator',
    title: 'Inventory Turnover Calculator',
    desc: 'Measure inventory efficiency and turnover ratio',
    category: 'Business',
    cpc: 'Medium ($8-18/click)',
  },
  {
    slug: 'freelance-rate-calculator',
    title: 'Freelance Rate Calculator',
    desc: 'Calculate your hourly or project rate as a freelancer',
    category: 'Business',
    cpc: 'Medium ($5-15/click)',
  },
  {
    slug: 'customer-lifetime-value-calculator',
    title: 'Customer Lifetime Value (CLV) Calculator',
    desc: 'Calculate the total value of a customer over time',
    category: 'Business',
    cpc: 'High ($15-35/click)',
  },
  {
    slug: 'conversion-rate-calculator',
    title: 'Conversion Rate Calculator',
    desc: 'Calculate website and marketing conversion rates',
    category: 'Business',
    cpc: 'Medium ($10-22/click)',
  },
  {
    slug: 'gross-profit-margin-calculator',
    title: 'Gross Profit Margin Calculator',
    desc: 'Calculate gross profit margin and markup percentage',
    category: 'Business',
    cpc: 'Medium ($8-18/click)',
  },
  {
    slug: 'revenue-per-employee-calculator',
    title: 'Revenue Per Employee Calculator',
    desc: 'Measure business efficiency and productivity',
    category: 'Business',
    cpc: 'Medium ($6-14/click)',
  },
];

function generateHTML(calc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free Online Tool | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free ${calc.title.toLowerCase()} for business planning, analysis, and decision-making. Easy to use, accurate results.">
    <link rel="canonical" href="https://calcleap.com/${calc.slug}.html">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .main { padding: 2rem 0; }
        .calculator-box { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .calculator-box h2 { margin-bottom: 1.5rem; color: #667eea; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; transition: border 0.3s; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #667eea; }
        .input-group .hint { font-size: 0.85rem; color: #777; margin-top: 0.25rem; }
        .btn { background: #667eea; color: white; border: none; padding: 0.75rem 2rem; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s; }
        .btn:hover { background: #5568d3; }
        .result-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 1.5rem; border-radius: 6px; margin-top: 1.5rem; display: none; }
        .result-box.show { display: block; }
        .result-box h3 { color: #667eea; margin-bottom: 1rem; }
        .result-item { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e0e6ed; }
        .result-item:last-child { border-bottom: none; }
        .result-label { font-weight: 600; color: #555; }
        .result-value { color: #667eea; font-weight: 700; font-size: 1.1rem; }
        .info-section { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .info-section h3 { color: #667eea; margin-bottom: 1rem; }
        .info-section p { margin-bottom: 1rem; }
        .info-section ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .info-section ul li { margin-bottom: 0.5rem; }
        .ad-placeholder { background: #f0f0f0; border: 2px dashed #ccc; padding: 2rem; text-align: center; margin: 2rem 0; border-radius: 8px; min-height: 250px; display: flex; align-items: center; justify-content: center; }
        .footer { background: #2d3748; color: white; padding: 2rem 0; text-align: center; }
        .footer a { color: #667eea; text-decoration: none; margin: 0 0.5rem; }
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
        <!-- Ad Slot 1 -->
        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calculator-box">
            <h2>${calc.title}</h2>
            <div id="calculator-form"></div>
            <div class="result-box" id="result">
                <h3>Results</h3>
                <div id="result-content"></div>
            </div>
        </div>

        <!-- Ad Slot 2 -->
        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567891" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-section">
            <h3>About This Calculator</h3>
            <p>${calc.desc}. This free online tool helps business owners, entrepreneurs, and financial professionals make informed decisions.</p>
            
            <h3>How to Use</h3>
            <p>Enter your business data in the fields above and click "Calculate" to see your results. All calculations are performed in your browser - your data stays private.</p>
            
            <h3>Why This Matters</h3>
            <p>Understanding your business metrics is crucial for growth, profitability, and making strategic decisions. Use this calculator as part of your regular business analysis.</p>
        </div>

        <!-- Ad Slot 3 -->
        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567892" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-section">
            <h3>More Business Tools</h3>
            <p>Check out our other business and financial calculators:</p>
            <ul>
                <li><a href="index.html">CalcLeap Home - All Tools</a></li>
                <li><a href="https://calcleap.com/">SmartCalc - Financial Calculators</a></li>
                <li><a href="https://calcleap.com/">HealthCalcs - Health & Wellness</a></li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 CalcLeap. Free online business tools and calculators.</p>
            <p><a href="index.html">Home</a> <a href="https://calcleap.com/">SmartCalc</a> <a href="https://calcleap.com/">HealthCalcs</a></p>
            <p style="margin-top:0.5rem; font-size:0.85rem;">Disclaimer: This calculator provides estimates for informational purposes only. Consult with a financial professional for specific advice.</p>
        </div>
    </div>

    <script src="business-calc-${calc.slug}.js"></script>
</body>
</html>`;
}

function generateJS(calc) {
  const forms = {
    'business-valuation-calculator': `
      <div class="input-group">
        <label>Annual Revenue ($)</label>
        <input type="number" id="revenue" placeholder="500000" step="1000">
      </div>
      <div class="input-group">
        <label>Annual Profit ($)</label>
        <input type="number" id="profit" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Industry Multiple</label>
        <select id="multiple">
          <option value="2">Low Growth (2x)</option>
          <option value="3" selected>Average (3x)</option>
          <option value="5">High Growth (5x)</option>
          <option value="7">Tech/SaaS (7x)</option>
        </select>
      </div>
      <button class="btn" onclick="calculate()">Calculate Valuation</button>`,
    
    'break-even-analysis-calculator': `
      <div class="input-group">
        <label>Fixed Costs (Monthly $)</label>
        <input type="number" id="fixed" placeholder="10000" step="100">
      </div>
      <div class="input-group">
        <label>Variable Cost per Unit ($)</label>
        <input type="number" id="variable" placeholder="20" step="0.01">
      </div>
      <div class="input-group">
        <label>Price per Unit ($)</label>
        <input type="number" id="price" placeholder="50" step="0.01">
      </div>
      <button class="btn" onclick="calculate()">Calculate Break-Even</button>`,
    
    'startup-cost-calculator': `
      <div class="input-group">
        <label>One-Time Costs ($)</label>
        <input type="number" id="onetime" placeholder="50000" step="1000">
        <div class="hint">Equipment, legal, licenses, initial inventory</div>
      </div>
      <div class="input-group">
        <label>Monthly Operating Costs ($)</label>
        <input type="number" id="monthly" placeholder="8000" step="100">
      </div>
      <div class="input-group">
        <label>Months Until Profitable</label>
        <input type="number" id="months" placeholder="12" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Total Startup Cost</button>`,
    
    'cash-flow-calculator': `
      <div class="input-group">
        <label>Monthly Revenue ($)</label>
        <input type="number" id="revenue" placeholder="50000" step="1000">
      </div>
      <div class="input-group">
        <label>Monthly Expenses ($)</label>
        <input type="number" id="expenses" placeholder="35000" step="1000">
      </div>
      <div class="input-group">
        <label>Starting Cash Balance ($)</label>
        <input type="number" id="balance" placeholder="20000" step="1000">
      </div>
      <button class="btn" onclick="calculate()">Calculate Cash Flow</button>`,
    
    'payroll-tax-calculator': `
      <div class="input-group">
        <label>Gross Payroll ($)</label>
        <input type="number" id="payroll" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>State</label>
        <select id="state">
          <option value="0.062">Federal Only (6.2% FICA)</option>
          <option value="0.08">California (8%)</option>
          <option value="0.075">New York (7.5%)</option>
          <option value="0.07">Other State Average (7%)</option>
        </select>
      </div>
      <button class="btn" onclick="calculate()">Calculate Payroll Taxes</button>`,
    
    'business-loan-calculator': `
      <div class="input-group">
        <label>Loan Amount ($)</label>
        <input type="number" id="amount" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Interest Rate (%)</label>
        <input type="number" id="rate" placeholder="7.5" step="0.1">
      </div>
      <div class="input-group">
        <label>Loan Term (Years)</label>
        <input type="number" id="years" placeholder="5" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Payment</button>`,
    
    'inventory-turnover-calculator': `
      <div class="input-group">
        <label>Cost of Goods Sold (Annual $)</label>
        <input type="number" id="cogs" placeholder="500000" step="1000">
      </div>
      <div class="input-group">
        <label>Average Inventory ($)</label>
        <input type="number" id="inventory" placeholder="50000" step="1000">
      </div>
      <button class="btn" onclick="calculate()">Calculate Turnover Ratio</button>`,
    
    'freelance-rate-calculator': `
      <div class="input-group">
        <label>Desired Annual Income ($)</label>
        <input type="number" id="income" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Billable Hours per Week</label>
        <input type="number" id="hours" placeholder="30" step="1">
      </div>
      <div class="input-group">
        <label>Weeks Worked per Year</label>
        <input type="number" id="weeks" placeholder="48" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Hourly Rate</button>`,
    
    'customer-lifetime-value-calculator': `
      <div class="input-group">
        <label>Average Purchase Value ($)</label>
        <input type="number" id="purchase" placeholder="100" step="1">
      </div>
      <div class="input-group">
        <label>Purchase Frequency (per year)</label>
        <input type="number" id="frequency" placeholder="4" step="0.1">
      </div>
      <div class="input-group">
        <label>Customer Lifespan (years)</label>
        <input type="number" id="lifespan" placeholder="5" step="0.5">
      </div>
      <button class="btn" onclick="calculate()">Calculate CLV</button>`,
    
    'conversion-rate-calculator': `
      <div class="input-group">
        <label>Total Visitors</label>
        <input type="number" id="visitors" placeholder="10000" step="100">
      </div>
      <div class="input-group">
        <label>Total Conversions</label>
        <input type="number" id="conversions" placeholder="250" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Conversion Rate</button>`,
    
    'gross-profit-margin-calculator': `
      <div class="input-group">
        <label>Revenue ($)</label>
        <input type="number" id="revenue" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Cost of Goods Sold ($)</label>
        <input type="number" id="cogs" placeholder="60000" step="1000">
      </div>
      <button class="btn" onclick="calculate()">Calculate Gross Profit Margin</button>`,
    
    'revenue-per-employee-calculator': `
      <div class="input-group">
        <label>Total Annual Revenue ($)</label>
        <input type="number" id="revenue" placeholder="5000000" step="10000">
      </div>
      <div class="input-group">
        <label>Number of Employees</label>
        <input type="number" id="employees" placeholder="25" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Revenue per Employee</button>`,
  };

  const calculations = {
    'business-valuation-calculator': `
      const revenue = parseFloat(document.getElementById('revenue').value);
      const profit = parseFloat(document.getElementById('profit').value);
      const multiple = parseFloat(document.getElementById('multiple').value);
      
      if (!revenue || !profit) return alert('Please enter all values');
      
      const revenueValue = revenue * multiple;
      const earningsValue = profit * (multiple + 2);
      const assetValue = (revenue * 0.5) + (profit * 3);
      const average = (revenueValue + earningsValue + assetValue) / 3;
      
      const _results = [
        { label: 'Revenue Multiple Method', value: '$' + revenueValue.toLocaleString() },
        { label: 'Earnings Multiple Method', value: '$' + earningsValue.toLocaleString() },
        { label: 'Asset-Based Method', value: '$' + assetValue.toLocaleString() },
        { label: 'Average Valuation', value: '$' + average.toLocaleString() },
        { label: 'Valuation Range', value: '$' + (average * 0.8).toLocaleString() + ' - $' + (average * 1.2).toLocaleString() },
      ];`,
    
    'break-even-analysis-calculator': `
      const fixed = parseFloat(document.getElementById('fixed').value);
      const variable = parseFloat(document.getElementById('variable').value);
      const price = parseFloat(document.getElementById('price').value);
      
      if (!fixed || !variable || !price) return alert('Please enter all values');
      if (price <= variable) return alert('Price must be greater than variable cost');
      
      const contribution = price - variable;
      const units = Math.ceil(fixed / contribution);
      const revenue = units * price;
      
      const _results = [
        { label: 'Break-Even Units', value: units.toLocaleString() + ' units/month' },
        { label: 'Break-Even Revenue', value: '$' + revenue.toLocaleString() + '/month' },
        { label: 'Contribution Margin', value: '$' + contribution.toFixed(2) + ' per unit' },
        { label: 'Contribution Margin %', value: ((contribution / price) * 100).toFixed(1) + '%' },
      ];`,
    
    'startup-cost-calculator': `
      const onetime = parseFloat(document.getElementById('onetime').value);
      const monthly = parseFloat(document.getElementById('monthly').value);
      const months = parseFloat(document.getElementById('months').value);
      
      if (!onetime || !monthly || !months) return alert('Please enter all values');
      
      const operating = monthly * months;
      const total = onetime + operating;
      const cushion = total * 1.2;
      
      const _results = [
        { label: 'One-Time Startup Costs', value: '$' + onetime.toLocaleString() },
        { label: 'Operating Costs (' + months + ' months)', value: '$' + operating.toLocaleString() },
        { label: 'Total Startup Cost', value: '$' + total.toLocaleString() },
        { label: 'Recommended w/ Cushion (20%)', value: '$' + cushion.toLocaleString() },
      ];`,
    
    'cash-flow-calculator': `
      const revenue = parseFloat(document.getElementById('revenue').value);
      const expenses = parseFloat(document.getElementById('expenses').value);
      const balance = parseFloat(document.getElementById('balance').value);
      
      if (revenue == null || expenses == null || balance == null) return alert('Please enter all values');
      
      const monthly = revenue - expenses;
      const annual = monthly * 12;
      const endBalance = balance + monthly;
      const runway = balance / expenses;
      
      const _results = [
        { label: 'Monthly Cash Flow', value: '$' + monthly.toLocaleString() + (monthly >= 0 ? ' (Positive)' : ' (Negative)') },
        { label: 'Annual Cash Flow', value: '$' + annual.toLocaleString() },
        { label: 'Ending Cash Balance', value: '$' + endBalance.toLocaleString() },
        { label: 'Cash Runway (if negative)', value: runway > 0 ? runway.toFixed(1) + ' months' : 'N/A' },
      ];`,
    
    'payroll-tax-calculator': `
      const payroll = parseFloat(document.getElementById('payroll').value);
      const stateRate = parseFloat(document.getElementById('state').value);
      
      if (!payroll) return alert('Please enter payroll amount');
      
      const fica = payroll * 0.0765;
      const futa = payroll * 0.006;
      const state = payroll * (stateRate - 0.062);
      const total = fica + futa + state;
      
      const _results = [
        { label: 'FICA (Social Security + Medicare)', value: '$' + fica.toLocaleString() },
        { label: 'FUTA (Federal Unemployment)', value: '$' + futa.toLocaleString() },
        { label: 'State Taxes (estimate)', value: '$' + state.toLocaleString() },
        { label: 'Total Employer Taxes', value: '$' + total.toLocaleString() },
        { label: 'Effective Tax Rate', value: ((total / payroll) * 100).toFixed(2) + '%' },
      ];`,
    
    'business-loan-calculator': `
      const amount = parseFloat(document.getElementById('amount').value);
      const rate = parseFloat(document.getElementById('rate').value) / 100 / 12;
      const years = parseFloat(document.getElementById('years').value);
      
      if (!amount || !rate || !years) return alert('Please enter all values');
      
      const months = years * 12;
      const payment = amount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const total = payment * months;
      const interest = total - amount;
      
      const _results = [
        { label: 'Monthly Payment', value: '$' + payment.toFixed(2) },
        { label: 'Total Paid', value: '$' + total.toLocaleString() },
        { label: 'Total Interest', value: '$' + interest.toLocaleString() },
        { label: 'Interest as % of Loan', value: ((interest / amount) * 100).toFixed(1) + '%' },
      ];`,
    
    'inventory-turnover-calculator': `
      const cogs = parseFloat(document.getElementById('cogs').value);
      const inventory = parseFloat(document.getElementById('inventory').value);
      
      if (!cogs || !inventory) return alert('Please enter all values');
      
      const turnover = cogs / inventory;
      const days = 365 / turnover;
      
      let health = 'Low';
      if (turnover > 4) health = 'Good';
      if (turnover > 8) health = 'Excellent';
      
      const _results = [
        { label: 'Inventory Turnover Ratio', value: turnover.toFixed(2) + 'x per year' },
        { label: 'Days to Sell Inventory', value: days.toFixed(0) + ' days' },
        { label: 'Health Assessment', value: health },
      ];`,
    
    'freelance-rate-calculator': `
      const income = parseFloat(document.getElementById('income').value);
      const hours = parseFloat(document.getElementById('hours').value);
      const weeks = parseFloat(document.getElementById('weeks').value);
      
      if (!income || !hours || !weeks) return alert('Please enter all values');
      
      const totalHours = hours * weeks;
      const hourly = income / totalHours;
      const daily = hourly * 8;
      const monthly = income / 12;
      
      const _results = [
        { label: 'Minimum Hourly Rate', value: '$' + hourly.toFixed(2) },
        { label: 'Daily Rate (8 hours)', value: '$' + daily.toFixed(2) },
        { label: 'Monthly Income Goal', value: '$' + monthly.toLocaleString() },
        { label: 'Total Billable Hours/Year', value: totalHours.toLocaleString() },
      ];`,
    
    'customer-lifetime-value-calculator': `
      const purchase = parseFloat(document.getElementById('purchase').value);
      const frequency = parseFloat(document.getElementById('frequency').value);
      const lifespan = parseFloat(document.getElementById('lifespan').value);
      
      if (!purchase || !frequency || !lifespan) return alert('Please enter all values');
      
      const annual = purchase * frequency;
      const clv = annual * lifespan;
      
      const _results = [
        { label: 'Annual Value per Customer', value: '$' + annual.toFixed(2) },
        { label: 'Customer Lifetime Value (CLV)', value: '$' + clv.toFixed(2) },
        { label: 'Max Acquisition Cost (33% rule)', value: '$' + (clv * 0.33).toFixed(2) },
      ];`,
    
    'conversion-rate-calculator': `
      const visitors = parseFloat(document.getElementById('visitors').value);
      const conversions = parseFloat(document.getElementById('conversions').value);
      
      if (!visitors || !conversions) return alert('Please enter all values');
      
      const rate = (conversions / visitors) * 100;
      
      let benchmark = 'Below Average';
      if (rate > 2) benchmark = 'Average';
      if (rate > 5) benchmark = 'Good';
      if (rate > 10) benchmark = 'Excellent';
      
      const _results = [
        { label: 'Conversion Rate', value: rate.toFixed(2) + '%' },
        { label: 'Visitors Needed for 1 Conversion', value: Math.ceil(1 / (conversions / visitors)) },
        { label: 'Performance', value: benchmark },
      ];`,
    
    'gross-profit-margin-calculator': `
      const revenue = parseFloat(document.getElementById('revenue').value);
      const cogs = parseFloat(document.getElementById('cogs').value);
      
      if (!revenue || !cogs) return alert('Please enter all values');
      
      const profit = revenue - cogs;
      const margin = (profit / revenue) * 100;
      
      const _results = [
        { label: 'Gross Profit', value: '$' + profit.toLocaleString() },
        { label: 'Gross Profit Margin', value: margin.toFixed(2) + '%' },
        { label: 'Cost Ratio', value: ((cogs / revenue) * 100).toFixed(2) + '%' },
      ];`,
    
    'revenue-per-employee-calculator': `
      const revenue = parseFloat(document.getElementById('revenue').value);
      const employees = parseFloat(document.getElementById('employees').value);
      
      if (!revenue || !employees) return alert('Please enter all values');
      
      const perEmployee = revenue / employees;
      
      let benchmark = 'Below Average';
      if (perEmployee > 150000) benchmark = 'Average';
      if (perEmployee > 250000) benchmark = 'Good';
      if (perEmployee > 500000) benchmark = 'Excellent';
      
      const _results = [
        { label: 'Revenue per Employee', value: '$' + perEmployee.toLocaleString() },
        { label: 'Monthly Revenue per Employee', value: '$' + (perEmployee / 12).toLocaleString() },
        { label: 'Productivity Benchmark', value: benchmark },
      ];`,
  };

  return `
document.getElementById('calculator-form').innerHTML = \`${forms[calc.slug]}\`;

function calculate() {
  ${calculations[calc.slug]}
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
`;
}

let count = 0;
calculators.forEach(calc => {
  const html = generateHTML(calc);
  const js = generateJS(calc);
  
  fs.writeFileSync(path.join(__dirname, `${calc.slug}.html`), html);
  fs.writeFileSync(path.join(__dirname, `business-calc-${calc.slug}.js`), js);
  count++;
  console.log(`✓ Generated ${calc.slug}.html + JS`);
});

console.log(`\n✅ Generated ${count} business calculator pages (${count * 2} files total)`);
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
