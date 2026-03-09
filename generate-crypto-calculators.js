#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Crypto calculators - high search volume
const calculators = [
  {
    slug: 'bitcoin-profit-calculator',
    title: 'Bitcoin Profit Calculator',
    desc: 'Calculate Bitcoin investment profits and ROI based on buy/sell prices.',
    category: 'Cryptocurrency',
    inputs: [
      { id: 'buy-price', label: 'Buy Price per BTC ($)', type: 'number', min: 0, default: 30000, step: 0.01 },
      { id: 'sell-price', label: 'Sell Price per BTC ($)', type: 'number', min: 0, default: 50000, step: 0.01 },
      { id: 'investment', label: 'Investment Amount ($)', type: 'number', min: 0, default: 10000 },
      { id: 'fees', label: 'Trading Fees (%)', type: 'number', min: 0, max: 10, default: 0.5, step: 0.1 },
    ]
  },
  {
    slug: 'ethereum-calculator',
    title: 'Ethereum Calculator',
    desc: 'Calculate Ethereum investment returns and ETH to USD conversions.',
    category: 'Cryptocurrency',
    inputs: [
      { id: 'buy-price', label: 'Buy Price per ETH ($)', type: 'number', min: 0, default: 2000, step: 0.01 },
      { id: 'sell-price', label: 'Sell Price per ETH ($)', type: 'number', min: 0, default: 3000, step: 0.01 },
      { id: 'investment', label: 'Investment Amount ($)', type: 'number', min: 0, default: 5000 },
      { id: 'fees', label: 'Trading Fees (%)', type: 'number', min: 0, max: 10, default: 0.5, step: 0.1 },
    ]
  },
  {
    slug: 'crypto-tax-calculator',
    title: 'Crypto Tax Calculator',
    desc: 'Calculate capital gains tax on cryptocurrency trading profits.',
    category: 'Crypto Tax',
    inputs: [
      { id: 'profit', label: 'Total Profit ($)', type: 'number', min: 0, default: 10000 },
      { id: 'holding-period', label: 'Holding Period', type: 'select', options: ['Short-term (<1 year)', 'Long-term (>1 year)'] },
      { id: 'income', label: 'Annual Income ($)', type: 'number', min: 0, default: 75000 },
      { id: 'filing-status', label: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] },
    ]
  },
  {
    slug: 'crypto-mining-calculator',
    title: 'Crypto Mining Calculator',
    desc: 'Calculate mining profitability based on hash rate and electricity costs.',
    category: 'Crypto Mining',
    inputs: [
      { id: 'hash-rate', label: 'Hash Rate (MH/s)', type: 'number', min: 0, default: 100 },
      { id: 'power', label: 'Power Consumption (W)', type: 'number', min: 0, default: 1200 },
      { id: 'electricity-cost', label: 'Electricity Cost ($/kWh)', type: 'number', min: 0, default: 0.12, step: 0.01 },
      { id: 'pool-fee', label: 'Pool Fee (%)', type: 'number', min: 0, max: 5, default: 1, step: 0.1 },
      { id: 'coin-price', label: 'Coin Price ($)', type: 'number', min: 0, default: 50000 },
    ]
  },
  {
    slug: 'dogecoin-calculator',
    title: 'Dogecoin Calculator',
    desc: 'Calculate Dogecoin investment returns and DOGE to USD conversions.',
    category: 'Cryptocurrency',
    inputs: [
      { id: 'buy-price', label: 'Buy Price per DOGE ($)', type: 'number', min: 0, default: 0.10, step: 0.0001 },
      { id: 'sell-price', label: 'Sell Price per DOGE ($)', type: 'number', min: 0, default: 0.20, step: 0.0001 },
      { id: 'investment', label: 'Investment Amount ($)', type: 'number', min: 0, default: 1000 },
      { id: 'fees', label: 'Trading Fees (%)', type: 'number', min: 0, max: 10, default: 0.5, step: 0.1 },
    ]
  },
  {
    slug: 'crypto-portfolio-tracker',
    title: 'Crypto Portfolio Tracker',
    desc: 'Track cryptocurrency portfolio value and calculate overall returns.',
    category: 'Crypto Portfolio',
    inputs: [
      { id: 'btc-amount', label: 'Bitcoin (BTC)', type: 'number', min: 0, default: 0.1, step: 0.001 },
      { id: 'btc-price', label: 'BTC Price ($)', type: 'number', min: 0, default: 50000 },
      { id: 'eth-amount', label: 'Ethereum (ETH)', type: 'number', min: 0, default: 2, step: 0.01 },
      { id: 'eth-price', label: 'ETH Price ($)', type: 'number', min: 0, default: 3000 },
      { id: 'other-value', label: 'Other Coins Value ($)', type: 'number', min: 0, default: 5000 },
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
        .profit { color: #10b981; }
        .loss { color: #ef4444; }
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
            <p>Use this ${calc.title.toLowerCase()} to analyze your cryptocurrency investments. All calculations are estimates.</p>
            <p><strong>Disclaimer:</strong> Cryptocurrency investments are highly volatile and risky. This calculator is for informational purposes only and not financial advice.</p>
            <h3>More Financial Tools</h3>
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
            
            ${calc.slug === 'bitcoin-profit-calculator' || calc.slug === 'ethereum-calculator' || calc.slug === 'dogecoin-calculator' ? `
            const buyPrice = parseFloat(document.getElementById('buy-price').value);
            const sellPrice = parseFloat(document.getElementById('sell-price').value);
            const investment = parseFloat(document.getElementById('investment').value);
            const feePercent = parseFloat(document.getElementById('fees').value) / 100;
            
            const coins = investment / buyPrice;
            const grossProceeds = coins * sellPrice;
            const buyFees = investment * feePercent;
            const sellFees = grossProceeds * feePercent;
            const netProceeds = grossProceeds - sellFees;
            const totalCost = investment + buyFees;
            const profit = netProceeds - totalCost;
            const roi = (profit / totalCost) * 100;
            
            const profitClass = profit >= 0 ? 'profit' : 'loss';
            html += '<div class="result-value ' + profitClass + '">Profit: $' + profit.toFixed(2) + '</div>';
            html += '<div class="result-detail">ROI: ' + roi.toFixed(2) + '%</div>';
            html += '<div class="result-detail">Coins: ' + coins.toFixed(8) + '</div>';
            html += '<div class="result-detail">Total Cost: $' + totalCost.toFixed(2) + '</div>';
            html += '<div class="result-detail">Net Proceeds: $' + netProceeds.toFixed(2) + '</div>';
            html += '<div class="result-detail">Total Fees: $' + (buyFees + sellFees).toFixed(2) + '</div>';
            ` : ''}
            
            ${calc.slug === 'crypto-tax-calculator' ? `
            const profit = parseFloat(document.getElementById('profit').value);
            const holdingPeriod = document.getElementById('holding-period').value;
            const income = parseFloat(document.getElementById('income').value);
            
            let taxRate = 0.22; // default federal rate
            if (holdingPeriod.includes('Long-term')) {
                if (income <= 44625) taxRate = 0;
                else if (income <= 492300) taxRate = 0.15;
                else taxRate = 0.20;
            } else {
                if (income <= 11000) taxRate = 0.10;
                else if (income <= 44725) taxRate = 0.12;
                else if (income <= 95375) taxRate = 0.22;
                else if (income <= 182100) taxRate = 0.24;
                else taxRate = 0.32;
            }
            
            const federalTax = profit * taxRate;
            const afterTax = profit - federalTax;
            
            html += '<div class="result-value">Tax Owed: $' + federalTax.toFixed(2) + '</div>';
            html += '<div class="result-detail">Profit After Tax: $' + afterTax.toFixed(2) + '</div>';
            html += '<div class="result-detail">Tax Rate: ' + (taxRate * 100).toFixed(0) + '%</div>';
            html += '<div class="result-detail">Holding Period: ' + holdingPeriod + '</div>';
            ` : ''}
            
            ${calc.slug === 'crypto-mining-calculator' ? `
            const hashRate = parseFloat(document.getElementById('hash-rate').value);
            const power = parseFloat(document.getElementById('power').value);
            const electricityCost = parseFloat(document.getElementById('electricity-cost').value);
            const poolFee = parseFloat(document.getElementById('pool-fee').value) / 100;
            const coinPrice = parseFloat(document.getElementById('coin-price').value);
            
            const dailyReward = (hashRate / 100000) * 0.00001; // simplified
            const dailyElectricity = (power / 1000) * 24 * electricityCost;
            const grossRevenue = dailyReward * coinPrice;
            const poolFees = grossRevenue * poolFee;
            const dailyProfit = grossRevenue - poolFees - dailyElectricity;
            const monthlyProfit = dailyProfit * 30;
            
            const profitClass = dailyProfit >= 0 ? 'profit' : 'loss';
            html += '<div class="result-value ' + profitClass + '">Daily Profit: $' + dailyProfit.toFixed(2) + '</div>';
            html += '<div class="result-detail">Monthly Profit: $' + monthlyProfit.toFixed(2) + '</div>';
            html += '<div class="result-detail">Daily Revenue: $' + grossRevenue.toFixed(2) + '</div>';
            html += '<div class="result-detail">Daily Electricity: $' + dailyElectricity.toFixed(2) + '</div>';
            ` : ''}
            
            ${calc.slug === 'crypto-portfolio-tracker' ? `
            const btcAmount = parseFloat(document.getElementById('btc-amount').value);
            const btcPrice = parseFloat(document.getElementById('btc-price').value);
            const ethAmount = parseFloat(document.getElementById('eth-amount').value);
            const ethPrice = parseFloat(document.getElementById('eth-price').value);
            const otherValue = parseFloat(document.getElementById('other-value').value);
            
            const btcValue = btcAmount * btcPrice;
            const ethValue = ethAmount * ethPrice;
            const totalValue = btcValue + ethValue + otherValue;
            
            const btcPercent = (btcValue / totalValue) * 100;
            const ethPercent = (ethValue / totalValue) * 100;
            const otherPercent = (otherValue / totalValue) * 100;
            
            html += '<div class="result-value">Total Portfolio: $' + totalValue.toLocaleString() + '</div>';
            html += '<div class="result-detail">Bitcoin: $' + btcValue.toLocaleString() + ' (' + btcPercent.toFixed(1) + '%)</div>';
            html += '<div class="result-detail">Ethereum: $' + ethValue.toLocaleString() + ' (' + ethPercent.toFixed(1) + '%)</div>';
            html += '<div class="result-detail">Other Coins: $' + otherValue.toLocaleString() + ' (' + otherPercent.toFixed(1) + '%)</div>';
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

console.log(`\n✅ Generated ${count} cryptocurrency calculators`);
console.log('📝 High search volume niche: Bitcoin, Ethereum, Dogecoin, crypto tax, mining');
console.log('📝 Next: Update sitemap.xml and rebuild-index.js');
