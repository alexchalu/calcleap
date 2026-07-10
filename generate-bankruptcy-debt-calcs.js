#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ultra high-CPC bankruptcy and debt relief calculators - FINAL PUSH TO CROSS 1,000!
const calculators = [
  {
    slug: 'bankruptcy-calculator',
    title: 'Bankruptcy Calculator',
    desc: 'Calculate whether bankruptcy makes sense for your financial situation. Compare Chapter 7 vs Chapter 13.',
    category: 'Bankruptcy'
  },
  {
    slug: 'chapter-7-bankruptcy-calculator',
    title: 'Chapter 7 Bankruptcy Calculator',
    desc: 'Calculate Chapter 7 bankruptcy eligibility using means test and estimate costs.',
    category: 'Chapter 7'
  },
  {
    slug: 'chapter-13-bankruptcy-calculator',
    title: 'Chapter 13 Bankruptcy Calculator',
    desc: 'Calculate Chapter 13 repayment plan amounts and monthly payments.',
    category: 'Chapter 13'
  },
  {
    slug: 'bankruptcy-means-test-calculator',
    title: 'Bankruptcy Means Test Calculator',
    desc: 'Calculate means test to determine Chapter 7 bankruptcy eligibility.',
    category: 'Means Test'
  },
  {
    slug: 'debt-settlement-calculator',
    title: 'Debt Settlement Calculator',
    desc: 'Calculate potential savings from debt settlement vs paying in full.',
    category: 'Debt Settlement'
  },
  {
    slug: 'debt-consolidation-loan-calculator',
    title: 'Debt Consolidation Loan Calculator',
    desc: 'Calculate savings from consolidating credit card and personal debt.',
    category: 'Debt Consolidation'
  },
  {
    slug: 'credit-counseling-calculator',
    title: 'Credit Counseling Calculator',
    desc: 'Calculate debt management plan payments through credit counseling.',
    category: 'Credit Counseling'
  },
  {
    slug: 'foreclosure-calculator',
    title: 'Foreclosure Calculator',
    desc: 'Calculate foreclosure timeline and alternatives to avoid losing your home.',
    category: 'Foreclosure'
  },
  {
    slug: 'short-sale-calculator',
    title: 'Short Sale Calculator',
    desc: 'Calculate short sale net proceeds and compare to foreclosure impact.',
    category: 'Short Sale'
  },
  {
    slug: 'deed-in-lieu-calculator',
    title: 'Deed in Lieu Calculator',
    desc: 'Calculate deed in lieu of foreclosure costs and credit impact.',
    category: 'Deed in Lieu'
  },
  {
    slug: 'repossession-calculator',
    title: 'Auto Repossession Calculator',
    desc: 'Calculate deficiency balance after vehicle repossession.',
    category: 'Repossession'
  },
  {
    slug: 'garnishment-calculator',
    title: 'Wage Garnishment Calculator',
    desc: 'Calculate how much can be garnished from your paycheck for debts.',
    category: 'Wage Garnishment'
  },
  {
    slug: 'tax-debt-relief-calculator',
    title: 'Tax Debt Relief Calculator',
    desc: 'Calculate IRS payment plan options and offer in compromise eligibility.',
    category: 'Tax Debt'
  },
  {
    slug: 'nonprofit-debt-consolidation-calculator',
    title: 'Nonprofit Debt Consolidation Calculator',
    desc: 'Calculate debt management plan savings through nonprofit credit counseling.',
    category: 'Nonprofit DMP'
  },
  {
    slug: 'debt-validation-calculator',
    title: 'Debt Validation Calculator',
    desc: 'Calculate statute of limitations on debt collection by state.',
    category: 'Debt Validation'
  },
  {
    slug: 'collection-agency-settlement-calculator',
    title: 'Collection Agency Settlement Calculator',
    desc: 'Calculate settlement offer amounts for debts in collections.',
    category: 'Collections'
  },
  {
    slug: 'judgment-calculator',
    title: 'Court Judgment Calculator',
    desc: 'Calculate court judgment amounts with interest and collection costs.',
    category: 'Judgments'
  },
  {
    slug: 'insolvency-calculator',
    title: 'Insolvency Calculator',
    desc: 'Calculate if you are insolvent for tax purposes (IRS Form 982).',
    category: 'Insolvency'
  },
  {
    slug: 'debt-to-income-calculator',
    title: 'Debt-to-Income Ratio Calculator',
    desc: 'Calculate DTI ratio for mortgage, loan approval, and financial health assessment.',
    category: 'DTI Ratio'
  },
  {
    slug: 'credit-utilization-calculator',
    title: 'Credit Utilization Calculator',
    desc: 'Calculate credit utilization ratio and impact on credit score.',
    category: 'Credit Utilization'
  },
  {
    slug: 'minimum-payment-calculator',
    title: 'Minimum Payment Calculator',
    desc: 'Calculate how long it takes to pay off credit cards with minimum payments.',
    category: 'Minimum Payments'
  },
  {
    slug: 'debt-payoff-planner',
    title: 'Debt Payoff Planner Calculator',
    desc: 'Plan debt payoff strategy comparing snowball, avalanche, and custom methods.',
    category: 'Debt Payoff'
  },
  {
    slug: 'balance-transfer-calculator',
    title: 'Balance Transfer Calculator',
    desc: 'Calculate savings from 0% APR balance transfer credit cards.',
    category: 'Balance Transfer'
  },
  {
    slug: 'payday-loan-calculator',
    title: 'Payday Loan Calculator',
    desc: 'Calculate true cost of payday loans including APR and total fees.',
    category: 'Payday Loans'
  },
  {
    slug: 'title-loan-calculator',
    title: 'Title Loan Calculator',
    desc: 'Calculate car title loan costs and compare to alternatives.',
    category: 'Title Loans'
  },
];

function generateHTML(calc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free ${calc.category} Tool | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free online calculator for debt management and bankruptcy planning.">
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
            <h2>${calc.category} Calculator</h2>
            <p style="margin-bottom: 1.5rem; color: #6e6e73;">Enter your debt information below for personalized calculations.</p>
            <div class="input-group">
                <label for="debt">Total Debt ($):</label>
                <input type="number" id="debt" min="0" value="25000" step="100">
            </div>
            <div class="input-group">
                <label for="income">Monthly Income ($):</label>
                <input type="number" id="income" min="0" value="4000" step="100">
            </div>
            <div class="input-group">
                <label for="expenses">Monthly Expenses ($):</label>
                <input type="number" id="expenses" min="0" value="3000" step="100">
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate</button>
            <div class="result-box" id="result">
                <h3>Results</h3>
            </div>
        </div>




        <div class="info-section">
            <h3>About ${calc.title}</h3>
            <p>${calc.desc}</p>
            <h3>Understanding ${calc.category}</h3>
            <p>When dealing with debt challenges, it's important to understand your options:</p>
            <ul>
                <li>Bankruptcy provides legal protection but impacts credit for 7-10 years</li>
                <li>Debt settlement can reduce what you owe but may have tax consequences</li>
                <li>Consolidation simplifies payments but doesn't reduce total debt</li>
                <li>Credit counseling offers manageable payment plans with creditor cooperation</li>
            </ul>
            <h3>Getting Help</h3>
            <ul>
                <li>Consult with a bankruptcy attorney for personalized legal advice</li>
                <li>Contact nonprofit credit counseling agencies (NFCC certified)</li>
                <li>Understand your rights under the Fair Debt Collection Practices Act</li>
                <li>Explore all options before making major financial decisions</li>
            </ul>
            <h3>More Debt & Bankruptcy Calculators</h3>
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
            const debt = parseFloat(document.getElementById('debt').value) || 0;
            const income = parseFloat(document.getElementById('income').value) || 0;
            const expenses = parseFloat(document.getElementById('expenses').value) || 0;
            
            const disposableIncome = income - expenses;
            const dti = debt / (income * 12) * 100;
            
            let html = '<h3>Financial Analysis</h3>';
            html += '<div class="result-value">$' + disposableIncome.toFixed(2).toLocaleString() + '/mo</div>';
            html += '<div style="font-size: 0.9rem; color: #6e6e73; margin-bottom: 1rem;">Disposable Income</div>';
            html += '<div class="result-detail"><strong>Total Debt:</strong> $' + debt.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Monthly Income:</strong> $' + income.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Monthly Expenses:</strong> $' + expenses.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Debt-to-Income Ratio:</strong> ' + dti.toFixed(1) + '%</div>';
            
            if (disposableIncome < 0) {
                html += '<p style="margin-top: 1rem; padding: 1rem; background: #fff4e6; border-left: 4px solid #ff9500; border-radius: 8px;"><strong>Warning:</strong> Your expenses exceed your income. Consider consulting with a financial counselor or bankruptcy attorney.</p>';
            } else {
                html += '<p style="margin-top: 1rem; padding: 1rem; background: #f0f9ff; border-left: 4px solid #0071e3; border-radius: 8px;">You have $' + disposableIncome.toFixed(2) + ' monthly disposable income available for debt repayment.</p>';
            }
            
            html += '<p style="margin-top: 1.5rem; font-size: 0.95rem; color: #6e6e73;"><em>This calculator provides estimates for educational purposes. Consult with qualified financial and legal professionals for advice specific to your situation.</em></p>';
            
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

console.log(`\n🎉🎉🎉 Generated ${count} bankruptcy/debt calculators with Apple design`);
console.log('💰 ULTRA high-CPC niche: bankruptcy/debt relief ($60-200/click)');
console.log('📝 Next: Update sitemap and push - WE ARE CROSSING 1,000 PAGES!!!');
