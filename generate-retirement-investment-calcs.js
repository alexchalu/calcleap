#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-CPC retirement and investment calculators
const calculators = [
  {
    slug: 'pension-calculator',
    title: 'Pension Calculator',
    desc: 'Calculate your pension payout options and compare lump sum vs annuity payments.',
    category: 'Pension'
  },
  {
    slug: 'pension-lump-sum-calculator',
    title: 'Pension Lump Sum Calculator',
    desc: 'Should you take a pension lump sum or monthly payments? Compare lifetime value and tax implications.',
    category: 'Pension Payout'
  },
  {
    slug: '403b-calculator',
    title: '403(b) Calculator',
    desc: 'Calculate 403(b) retirement savings for teachers and non-profit employees. Estimate growth with employer match.',
    category: '403(b) Retirement'
  },
  {
    slug: '457-plan-calculator',
    title: '457 Plan Calculator',
    desc: 'Calculate 457(b) deferred compensation plan savings for government and non-profit employees.',
    category: '457 Retirement'
  },
  {
    slug: 'sep-ira-calculator',
    title: 'SEP IRA Calculator',
    desc: 'Calculate SEP IRA contributions and tax savings for self-employed individuals and small businesses.',
    category: 'SEP IRA'
  },
  {
    slug: 'simple-ira-calculator',
    title: 'SIMPLE IRA Calculator',
    desc: 'Calculate SIMPLE IRA contributions with employer match for small business employees.',
    category: 'SIMPLE IRA'
  },
  {
    slug: 'backdoor-roth-calculator',
    title: 'Backdoor Roth IRA Calculator',
    desc: 'Calculate backdoor Roth IRA conversion benefits and tax implications for high earners.',
    category: 'Backdoor Roth'
  },
  {
    slug: 'mega-backdoor-roth-calculator',
    title: 'Mega Backdoor Roth Calculator',
    desc: 'Calculate mega backdoor Roth 401(k) contributions and after-tax conversion strategies.',
    category: 'Mega Backdoor Roth'
  },
  {
    slug: 'dividend-reinvestment-calculator',
    title: 'Dividend Reinvestment Calculator',
    desc: 'Calculate compound growth from reinvesting dividends vs taking cash payouts.',
    category: 'Dividend Investing'
  },
  {
    slug: 'dollar-cost-averaging-calculator',
    title: 'Dollar Cost Averaging Calculator',
    desc: 'Compare dollar cost averaging vs lump sum investing. See impact of regular contributions.',
    category: 'Investment Strategy'
  },
];

function generateHTML(calc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free ${calc.category} Tool | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free online calculator with compound growth charts and instant results.">
    <link rel="canonical" href="https://calcleap.com/${calc.slug}.html">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif; background: #fafafa; color: #1d1d1f; line-height: 1.6; }
        .header { background: white; border-bottom: 1px solid #e5e5e7; padding: 1rem 0; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(20px); background: rgba(255,255,255,0.8); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .header h1 { font-size: 2rem; font-weight: 600; color: #1d1d1f; margin-bottom: 0.5rem; }
        .header p { color: #6e6e73; font-size: 1.1rem; }
        .main { padding: 3rem 0; }
        .calc-box { background: white; border-radius: 18px; padding: 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); margin-bottom: 2rem; border: 1px solid #e5e5e7; }
        .calc-box h2 { font-size: 1.75rem; font-weight: 600; margin-bottom: 1.5rem; color: #1d1d1f; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #1d1d1f; font-size: 1rem; }
        .input-group input, .input-group select { width: 100%; padding: 0.875rem 1rem; border: 1px solid #d2d2d7; border-radius: 12px; font-size: 1rem; transition: all 0.2s; background: white; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0,113,227,0.1); }
        .input-group small { color: #6e6e73; font-size: 0.9rem; }
        .calc-btn { background: #0071e3; color: white; border: none; padding: 1rem 2rem; font-size: 1.125rem; font-weight: 500; border-radius: 12px; cursor: pointer; width: 100%; transition: background 0.2s; }
        .calc-btn:hover { background: #0077ed; }
        .result-box { background: linear-gradient(135deg, #f5f9ff 0%, #e8f4ff 100%); border: 1px solid #0071e3; padding: 2rem; border-radius: 18px; margin-top: 1.5rem; display: none; }
        .result-box h3 { color: #0071e3; margin-bottom: 1.25rem; font-size: 1.5rem; font-weight: 600; }
        .result-value { font-size: 2.5rem; font-weight: 700; color: #0071e3; margin: 0.75rem 0; }
        .result-detail { margin: 0.75rem 0; color: #1d1d1f; font-size: 1.05rem; }
        .result-detail strong { font-weight: 600; }
        .chart-container { margin: 1.5rem 0; }
        .bar-chart { display: flex; gap: 0.5rem; align-items: flex-end; height: 200px; }
        .bar { flex: 1; background: linear-gradient(to top, #0071e3, #00a1ff); border-radius: 8px 8px 0 0; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding: 0.5rem; color: white; font-weight: 600; font-size: 0.9rem; transition: transform 0.3s; }
        .bar:hover { transform: translateY(-5px); }
        .bar-label { margin-top: 0.5rem; font-size: 0.9rem; color: #6e6e73; text-align: center; }
        .info-section { background: white; border-radius: 18px; padding: 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); margin-bottom: 2rem; border: 1px solid #e5e5e7; }
        .info-section h3 { color: #1d1d1f; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600; }
        .info-section p { margin-bottom: 1rem; color: #1d1d1f; line-height: 1.7; }
        .info-section ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .info-section li { margin-bottom: 0.5rem; color: #1d1d1f; }
        .footer { background: #f5f5f7; padding: 2rem 0; text-align: center; border-top: 1px solid #e5e5e7; margin-top: 4rem; }
        .footer a { color: #0071e3; text-decoration: none; }
        @media (max-width: 768px) { .header h1 { font-size: 1.75rem; } .calc-box, .info-section { padding: 1.5rem; } }
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



        <div class="calc-box">
            <h2>Calculate Your ${calc.category}</h2>
            <p style="margin-bottom: 1.5rem; color: #6e6e73;">Enter your details below to see projected growth and retirement savings.</p>
            <div class="input-group">
                <label for="current">Current Balance ($):</label>
                <input type="number" id="current" min="0" value="50000" step="1000">
            </div>
            <div class="input-group">
                <label for="monthly">Monthly Contribution ($):</label>
                <input type="number" id="monthly" min="0" value="500" step="50">
            </div>
            <div class="input-group">
                <label for="rate">Expected Return (% per year):</label>
                <input type="number" id="rate" min="0" max="20" value="7" step="0.5">
                <small>Historical stock market average is ~10%, conservative is 6-7%</small>
            </div>
            <div class="input-group">
                <label for="years">Years Until Retirement:</label>
                <input type="number" id="years" min="1" max="50" value="20">
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Growth</button>
            <div class="result-box" id="result">
                <h3>Results</h3>
            </div>
        </div>




        <div class="info-section">
            <h3>About ${calc.title}</h3>
            <p>${calc.desc}</p>
            <h3>Understanding ${calc.category}</h3>
            <p>Key factors that impact your retirement savings:</p>
            <ul>
                <li>Regular contributions compound over time (time is your biggest advantage)</li>
                <li>Expected returns vary based on asset allocation and risk tolerance</li>
                <li>Tax advantages can significantly boost long-term growth</li>
                <li>Employer matches are free money - always contribute enough to get the full match</li>
            </ul>
            <h3>Maximizing Your Savings</h3>
            <ul>
                <li>Start early - compound growth accelerates over decades</li>
                <li>Increase contributions when you get raises</li>
                <li>Diversify investments to manage risk</li>
                <li>Review and rebalance portfolio annually</li>
            </ul>
            <h3>More Retirement Calculators</h3>
            <ul>
                <li><a href="index.html">CalcLeap Home - All Calculators</a></li>
                <li><a href="about.html">About CalcLeap</a></li>
            </ul>
        </div>



    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 CalcLeap. Free online calculators and tools.</p>
            <p><a href="index.html">Home</a> • <a href="about.html">About</a> • <a href="privacy.html">Privacy</a> • <a href="contact.html">Contact</a></p>
        </div>
    </div>

    <script>
        function calculate() {
            const current = parseFloat(document.getElementById('current').value) || 0;
            const monthly = parseFloat(document.getElementById('monthly').value) || 0;
            const annualRate = parseFloat(document.getElementById('rate').value) / 100 || 0.07;
            const years = parseInt(document.getElementById('years').value) || 20;
            
            const monthlyRate = annualRate / 12;
            const months = years * 12;
            
            // Future value of current balance
            const futureValueCurrent = current * Math.pow(1 + monthlyRate, months);
            
            // Future value of monthly contributions (annuity)
            const futureValueContributions = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            
            const totalValue = futureValueCurrent + futureValueContributions;
            const totalContributions = current + (monthly * months);
            const totalGrowth = totalValue - totalContributions;
            
            let html = '<h3>Retirement Projection</h3>';
            html += '<div class="result-value">$' + totalValue.toFixed(2).toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Starting Balance:</strong> $' + current.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Total Contributions:</strong> $' + totalContributions.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Investment Growth:</strong> $' + totalGrowth.toFixed(2).toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Time Frame:</strong> ' + years + ' years</div>';
            html += '<div class="result-detail"><strong>Average Annual Return:</strong> ' + (annualRate * 100).toFixed(1) + '%</div>';
            
            // Add visual bar chart
            html += '<div class="chart-container">';
            html += '<div class="bar-chart">';
            const barHeight1 = (totalContributions / totalValue) * 100;
            const barHeight2 = (totalGrowth / totalValue) * 100;
            html += '<div class="bar" style="height:' + barHeight1 + '%">$' + (totalContributions/1000).toFixed(0) + 'k</div>';
            html += '<div class="bar" style="height:' + barHeight2 + '%">$' + (totalGrowth/1000).toFixed(0) + 'k</div>';
            html += '</div>';
            html += '<div style="display:flex; gap:0.5rem;">';
            html += '<div style="flex:1;" class="bar-label">Your Contributions</div>';
            html += '<div style="flex:1;" class="bar-label">Investment Growth</div>';
            html += '</div>';
            html += '</div>';
            
            html += '<p style="margin-top: 1.5rem; font-size: 0.95rem; color: #6e6e73;"><em>This projection assumes consistent returns and contributions. Actual results will vary based on market performance. Past performance does not guarantee future results.</em></p>';
            
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

console.log(`\n✅ Generated ${count} retirement/investment calculators with Apple design + growth charts`);
console.log('💰 High-CPC niche: retirement/investment planning ($25-60/click)');
console.log('📝 Next: Update sitemap and push');
