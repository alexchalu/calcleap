#!/usr/bin/env node

const fs = require('fs');

const calculators = [
  {
    id: '401k-calculator',
    name: '401(k) Calculator',
    desc: 'Calculate 401(k) retirement savings with employer match',
    category: 'Investment',
  },
  {
    id: 'roth-ira-calculator',
    name: 'Roth IRA Calculator',
    desc: 'Calculate Roth IRA contributions and growth',
    category: 'Investment',
  },
  {
    id: 'traditional-ira-calculator',
    name: 'Traditional IRA Calculator',
    desc: 'Calculate Traditional IRA savings and tax benefits',
    category: 'Investment',
  },
  {
    id: 'investment-return-calculator',
    name: 'Investment Return Calculator',
    desc: 'Calculate ROI and total return on investments',
    category: 'Investment',
  },
  {
    id: 'dividend-yield-calculator',
    name: 'Dividend Yield Calculator',
    desc: 'Calculate dividend yield and annual dividend income',
    category: 'Investment',
  },
  {
    id: 'stock-portfolio-calculator',
    name: 'Stock Portfolio Calculator',
    desc: 'Track portfolio value and performance',
    category: 'Investment',
  },
  {
    id: 'capital-gains-tax-calculator',
    name: 'Capital Gains Tax Calculator',
    desc: 'Calculate short-term and long-term capital gains tax',
    category: 'Investment',
  },
  {
    id: 'bond-yield-calculator',
    name: 'Bond Yield Calculator',
    desc: 'Calculate bond yield to maturity (YTM)',
    category: 'Investment',
  },
];

function generateHTML(calc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.name} - Free Investment Tool | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free online ${calc.name.toLowerCase()} with detailed results. No signup required.">
    <link rel="canonical" href="https://calcleap.com/calc/${calc.id}.html">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .breadcrumb { margin-top: 0.5rem; font-size: 0.9rem; }
        .breadcrumb a { color: rgba(255,255,255,0.8); text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .main { padding: 2rem 0; }
        .calculator-box { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .calculator-box h2 { margin-bottom: 1.5rem; color: #667eea; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
        .input-group { display: flex; flex-direction: column; }
        .input-group label { margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input, .input-group select { padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; transition: border 0.3s; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #667eea; }
        .btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 2rem; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .btn:hover { transform: translateY(-2px); }
        .result-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 1.5rem; border-radius: 6px; margin-top: 1.5rem; display: none; }
        .result-box.show { display: block; }
        .result-box h3 { color: #667eea; margin-bottom: 1rem; }
        .result-item { margin-bottom: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #e0e6ed; }
        .result-item:last-child { border-bottom: none; }
        .result-label { font-weight: 600; color: #555; }
        .result-value { font-size: 1.2rem; color: #667eea; font-weight: 700; }
        .info-section { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .info-section h3 { color: #667eea; margin-bottom: 1rem; }
        .info-section p, .info-section ul { margin-bottom: 1rem; }
        .info-section ul { margin-left: 1.5rem; }
        .ad-placeholder { background: #f0f0f0; border: 2px dashed #ccc; padding: 2rem; text-align: center; margin: 2rem 0; border-radius: 8px; min-height: 250px; display: flex; align-items: center; justify-content: center; }
        .footer { background: #2d3748; color: white; padding: 2rem 0; text-align: center; }
        .footer a { color: #667eea; text-decoration: none; margin: 0 0.5rem; }
        @media (max-width: 768px) { .header h1 { font-size: 1.5rem; } .form-grid { grid-template-columns: 1fr; } }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${calc.name}</h1>
            <p>${calc.desc}</p>
            <div class="breadcrumb">
                <a href="../index.html">Home</a> › <a href="../index.html#finance">Investment Calculators</a> › ${calc.name}
            </div>
        </div>
    </div>

    <div class="main container">
        <!-- Ad Slot 1 -->
        <div class="ad-placeholder">


        </div>

        <div class="calculator-box">
            <h2>${calc.name}</h2>
            <form id="calc-form">
                <div class="form-grid" id="inputs"></div>
                <button type="submit" class="btn">Calculate</button>
            </form>
            <div class="result-box" id="results">
                <h3>Results</h3>
                <div id="result-content"></div>
            </div>
        </div>

        <!-- Ad Slot 2 -->
        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About ${calc.name}</h3>
            <div id="info-content"></div>
        </div>

        <!-- Ad Slot 3 -->
        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>More Investment & Financial Tools</h3>
            <p>Check out our other calculators:</p>
            <ul>
                <li><a href="../index.html">CalcLeap Home - All Tools</a></li>
                <li><a href="https://calcleap.com/">SmartCalc - Financial Calculators</a></li>
                <li><a href="https://calcleap.com/">HealthCalcs - Health & Wellness</a></li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 CalcLeap. Free online tools and calculators.</p>
            <p><a href="../index.html">Home</a> | <a href="https://calcleap.com/">SmartCalc</a> | <a href="https://calcleap.com/">HealthCalcs</a></p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem; opacity: 0.8;">Calculations are for informational purposes only. Consult a financial advisor for investment advice.</p>
        </div>
    </div>

    <script src="../app-calculator.js"></script>
    <script>
        const calcConfig = ${JSON.stringify(getCalcConfig(calc.id), null, 2)};
        initCalculator(calcConfig);
    </script>
</body>
</html>`;
}

function getCalcConfig(id) {
  const configs = {
    '401k-calculator': {
      inputs: [
        { name: 'age', label: 'Current Age', type: 'number', placeholder: '30', min: 18, max: 100 },
        { name: 'retirementAge', label: 'Retirement Age', type: 'number', placeholder: '65', min: 50, max: 80 },
        { name: 'currentBalance', label: 'Current 401(k) Balance ($)', type: 'number', placeholder: '50000', min: 0 },
        { name: 'annualSalary', label: 'Annual Salary ($)', type: 'number', placeholder: '75000', min: 0 },
        { name: 'contribution', label: 'Your Contribution (%)', type: 'number', placeholder: '10', min: 0, max: 100, step: 0.5 },
        { name: 'employerMatch', label: 'Employer Match (%)', type: 'number', placeholder: '5', min: 0, max: 50, step: 0.5 },
        { name: 'returnRate', label: 'Annual Return Rate (%)', type: 'number', placeholder: '7', min: 0, max: 30, step: 0.1 },
        { name: 'salaryIncrease', label: 'Annual Salary Increase (%)', type: 'number', placeholder: '3', min: 0, max: 20, step: 0.1 },
      ],
      calculate: (data) => {
        const years = data.retirementAge - data.age;
        const monthlyRate = data.returnRate / 100 / 12;
        const months = years * 12;
        
        let balance = data.currentBalance;
        let salary = data.annualSalary;
        
        for (let year = 0; year < years; year++) {
          const yourContrib = salary * (data.contribution / 100);
          const employerContrib = salary * (data.employerMatch / 100);
          const totalAnnual = yourContrib + employerContrib;
          
          for (let month = 0; month < 12; month++) {
            balance = balance * (1 + monthlyRate) + (totalAnnual / 12);
          }
          
          salary *= (1 + data.salaryIncrease / 100);
        }
        
        const totalContributions = data.currentBalance + (data.annualSalary * (data.contribution + data.employerMatch) / 100 * years);
        const earnings = balance - totalContributions;
        
        return {
          'Balance at Retirement': '$' + balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Contributions': '$' + totalContributions.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Investment Earnings': '$' + earnings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Years Until Retirement': years,
        };
      },
      info: '<p>A 401(k) is a retirement savings plan sponsored by an employer. Contributions are made pre-tax, reducing your taxable income.</p><p><strong>Key Points:</strong></p><ul><li>2026 contribution limit: $23,500 (under 50), $31,000 (50+)</li><li>Employer match is free money - always contribute enough to get the full match</li><li>Earnings grow tax-deferred until withdrawal</li><li>Early withdrawals before age 59½ face 10% penalty + income tax</li></ul>',
    },
    'roth-ira-calculator': {
      inputs: [
        { name: 'age', label: 'Current Age', type: 'number', placeholder: '30' },
        { name: 'retirementAge', label: 'Retirement Age', type: 'number', placeholder: '65' },
        { name: 'currentBalance', label: 'Current Roth IRA Balance ($)', type: 'number', placeholder: '10000' },
        { name: 'annualContribution', label: 'Annual Contribution ($)', type: 'number', placeholder: '7000' },
        { name: 'returnRate', label: 'Annual Return Rate (%)', type: 'number', placeholder: '7', step: 0.1 },
      ],
      calculate: (data) => {
        const years = data.retirementAge - data.age;
        let balance = data.currentBalance;
        
        for (let year = 0; year < years; year++) {
          balance = (balance + data.annualContribution) * (1 + data.returnRate / 100);
        }
        
        const totalContributions = data.currentBalance + (data.annualContribution * years);
        const earnings = balance - totalContributions;
        
        return {
          'Balance at Retirement': '$' + balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Contributions': '$' + totalContributions.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Tax-Free Earnings': '$' + earnings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Years to Grow': years,
        };
      },
      info: '<p>A Roth IRA is a retirement account where contributions are made with after-tax dollars, but all earnings and withdrawals in retirement are tax-free.</p><p><strong>Key Points:</strong></p><ul><li>2026 contribution limit: $7,000 (under 50), $8,000 (50+)</li><li>Income limits apply - phases out at higher incomes</li><li>Contributions can be withdrawn penalty-free anytime</li><li>Earnings can be withdrawn tax-free after age 59½ and 5 years</li><li>No required minimum distributions (RMDs)</li></ul>',
    },
    'capital-gains-tax-calculator': {
      inputs: [
        { name: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', placeholder: '50000' },
        { name: 'salePrice', label: 'Sale Price ($)', type: 'number', placeholder: '75000' },
        { name: 'holdingPeriod', label: 'Holding Period', type: 'select', options: ['Short-term (<1 year)', 'Long-term (>1 year)'] },
        { name: 'income', label: 'Annual Income ($)', type: 'number', placeholder: '100000' },
        { name: 'filingStatus', label: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] },
      ],
      calculate: (data) => {
        const gain = data.salePrice - data.purchasePrice;
        let taxRate;
        
        if (data.holdingPeriod === 'Short-term (<1 year)') {
          // Short-term = ordinary income tax rates
          if (data.income <= 11600) taxRate = 10;
          else if (data.income <= 47150) taxRate = 12;
          else if (data.income <= 100525) taxRate = 22;
          else if (data.income <= 191950) taxRate = 24;
          else if (data.income <= 243725) taxRate = 32;
          else if (data.income <= 609350) taxRate = 35;
          else taxRate = 37;
        } else {
          // Long-term capital gains rates
          const isMarried = data.filingStatus === 'Married Filing Jointly';
          if (data.income <= (isMarried ? 94050 : 47025)) taxRate = 0;
          else if (data.income <= (isMarried ? 583750 : 518900)) taxRate = 15;
          else taxRate = 20;
        }
        
        const tax = gain * (taxRate / 100);
        const netGain = gain - tax;
        
        return {
          'Capital Gain': '$' + gain.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Tax Rate': taxRate + '%',
          'Tax Owed': '$' + tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Net Gain After Tax': '$' + netGain.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        };
      },
      info: '<p>Capital gains tax is paid on profits from selling investments like stocks, bonds, or real estate.</p><p><strong>Key Points:</strong></p><ul><li>Short-term gains (held <1 year) taxed as ordinary income (10%-37%)</li><li>Long-term gains (held >1 year) taxed at lower rates (0%, 15%, 20%)</li><li>Hold investments longer than 1 year to qualify for lower rates</li><li>Tax-loss harvesting can offset gains</li><li>2026 rates shown - subject to change</li></ul>',
    },
    'dividend-yield-calculator': {
      inputs: [
        { name: 'stockPrice', label: 'Stock Price ($)', type: 'number', placeholder: '150', step: 0.01 },
        { name: 'annualDividend', label: 'Annual Dividend per Share ($)', type: 'number', placeholder: '6', step: 0.01 },
        { name: 'shares', label: 'Number of Shares', type: 'number', placeholder: '100' },
      ],
      calculate: (data) => {
        const yield_ = (data.annualDividend / data.stockPrice) * 100;
        const annualIncome = data.annualDividend * data.shares;
        const totalInvestment = data.stockPrice * data.shares;
        
        return {
          'Dividend Yield': yield_.toFixed(2) + '%',
          'Annual Dividend Income': '$' + annualIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Investment': '$' + totalInvestment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Quarterly Income': '$' + (annualIncome / 4).toFixed(2),
        };
      },
      info: '<p>Dividend yield measures the annual dividends paid by a stock relative to its price. Higher yields mean more income relative to your investment.</p><p><strong>Key Points:</strong></p><ul><li>Dividend yield = (Annual Dividend / Stock Price) × 100</li><li>Average S&P 500 dividend yield: ~1.5-2%</li><li>High yields (>5%) may indicate undervalued stock or risky dividend</li><li>Qualified dividends taxed at favorable capital gains rates</li><li>Dividends can be reinvested for compound growth</li></ul>',
    },
    'traditional-ira-calculator': {
      inputs: [
        { name: 'age', label: 'Current Age', type: 'number', placeholder: '30' },
        { name: 'retirementAge', label: 'Retirement Age', type: 'number', placeholder: '65' },
        { name: 'currentBalance', label: 'Current IRA Balance ($)', type: 'number', placeholder: '10000' },
        { name: 'annualContribution', label: 'Annual Contribution ($)', type: 'number', placeholder: '7000' },
        { name: 'returnRate', label: 'Annual Return Rate (%)', type: 'number', placeholder: '7', step: 0.1 },
        { name: 'taxRate', label: 'Current Tax Rate (%)', type: 'number', placeholder: '24', step: 0.1 },
      ],
      calculate: (data) => {
        const years = data.retirementAge - data.age;
        let balance = data.currentBalance;
        
        for (let year = 0; year < years; year++) {
          balance = (balance + data.annualContribution) * (1 + data.returnRate / 100);
        }
        
        const totalContributions = data.currentBalance + (data.annualContribution * years);
        const earnings = balance - totalContributions;
        const taxSavings = data.annualContribution * years * (data.taxRate / 100);
        
        return {
          'Balance at Retirement': '$' + balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Contributions': '$' + totalContributions.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Investment Earnings': '$' + earnings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Estimated Tax Savings': '$' + taxSavings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        };
      },
      info: '<p>A Traditional IRA allows tax-deductible contributions that grow tax-deferred until retirement.</p><p><strong>Key Points:</strong></p><ul><li>2026 contribution limit: $7,000 (under 50), $8,000 (50+)</li><li>Contributions may be tax-deductible (income limits apply if covered by employer plan)</li><li>Earnings grow tax-deferred</li><li>Withdrawals taxed as ordinary income in retirement</li><li>Required Minimum Distributions (RMDs) start at age 73</li></ul>',
    },
    'investment-return-calculator': {
      inputs: [
        { name: 'initialInvestment', label: 'Initial Investment ($)', type: 'number', placeholder: '10000' },
        { name: 'years', label: 'Investment Period (Years)', type: 'number', placeholder: '10' },
        { name: 'returnRate', label: 'Annual Return Rate (%)', type: 'number', placeholder: '8', step: 0.1 },
        { name: 'monthlyContribution', label: 'Monthly Contribution ($)', type: 'number', placeholder: '500' },
      ],
      calculate: (data) => {
        const monthlyRate = data.returnRate / 100 / 12;
        const months = data.years * 12;
        
        let balance = data.initialInvestment;
        for (let i = 0; i < months; i++) {
          balance = balance * (1 + monthlyRate) + data.monthlyContribution;
        }
        
        const totalContributions = data.initialInvestment + (data.monthlyContribution * months);
        const totalReturn = balance - totalContributions;
        const roi = (totalReturn / totalContributions) * 100;
        
        return {
          'Final Balance': '$' + balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Contributions': '$' + totalContributions.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Return': '$' + totalReturn.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Return on Investment (ROI)': roi.toFixed(2) + '%',
        };
      },
      info: '<p>Calculate the future value of your investment based on initial amount, regular contributions, and expected return rate.</p><p><strong>Key Points:</strong></p><ul><li>Historical S&P 500 average return: ~10% per year</li><li>Past performance doesn\'t guarantee future results</li><li>Regular contributions (dollar-cost averaging) reduce market timing risk</li><li>Consider inflation when evaluating real returns</li><li>Diversification reduces risk</li></ul>',
    },
    'stock-portfolio-calculator': {
      inputs: [
        { name: 'portfolioValue', label: 'Total Portfolio Value ($)', type: 'number', placeholder: '100000' },
        { name: 'annualReturn', label: 'Annual Return (%)', type: 'number', placeholder: '8', step: 0.1 },
        { name: 'annualContribution', label: 'Annual Contribution ($)', type: 'number', placeholder: '12000' },
        { name: 'years', label: 'Investment Period (Years)', type: 'number', placeholder: '10' },
      ],
      calculate: (data) => {
        let balance = data.portfolioValue;
        
        for (let year = 0; year < data.years; year++) {
          balance = (balance + data.annualContribution) * (1 + data.annualReturn / 100);
        }
        
        const totalContributions = data.portfolioValue + (data.annualContribution * data.years);
        const gains = balance - totalContributions;
        
        return {
          'Portfolio Value': '$' + balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Invested': '$' + totalContributions.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Total Gains': '$' + gains.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          'Gain Percentage': ((gains / totalContributions) * 100).toFixed(2) + '%',
        };
      },
      info: '<p>Track your stock portfolio growth over time with regular contributions and compound returns.</p><p><strong>Key Points:</strong></p><ul><li>Diversify across sectors and asset classes</li><li>Rebalance periodically to maintain target allocation</li><li>Consider index funds for low-cost diversification</li><li>Long-term investing reduces volatility impact</li><li>Review portfolio at least annually</li></ul>',
    },
    'bond-yield-calculator': {
      inputs: [
        { name: 'faceValue', label: 'Face Value ($)', type: 'number', placeholder: '1000' },
        { name: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', placeholder: '950' },
        { name: 'couponRate', label: 'Coupon Rate (%)', type: 'number', placeholder: '5', step: 0.1 },
        { name: 'yearsToMaturity', label: 'Years to Maturity', type: 'number', placeholder: '10' },
      ],
      calculate: (data) => {
        const annualCoupon = data.faceValue * (data.couponRate / 100);
        const currentYield = (annualCoupon / data.purchasePrice) * 100;
        
        // Approximate YTM using simplified formula
        const ytm = ((annualCoupon + ((data.faceValue - data.purchasePrice) / data.yearsToMaturity)) / 
                    ((data.faceValue + data.purchasePrice) / 2)) * 100;
        
        const totalInterest = annualCoupon * data.yearsToMaturity;
        const totalReturn = totalInterest + (data.faceValue - data.purchasePrice);
        
        return {
          'Current Yield': currentYield.toFixed(2) + '%',
          'Yield to Maturity (YTM)': ytm.toFixed(2) + '%',
          'Annual Coupon Payment': '$' + annualCoupon.toFixed(2),
          'Total Interest Income': '$' + totalInterest.toFixed(2),
          'Total Return at Maturity': '$' + totalReturn.toFixed(2),
        };
      },
      info: '<p>Calculate bond yields including current yield and yield to maturity (YTM).</p><p><strong>Key Points:</strong></p><ul><li>Current Yield = Annual Coupon / Current Price</li><li>YTM considers both coupon payments and capital gain/loss at maturity</li><li>Bond prices and yields move inversely</li><li>Rising interest rates decrease existing bond prices</li><li>Bonds provide more stability than stocks but lower long-term returns</li></ul>',
    },
  };
  
  return configs[id] || { inputs: [], calculate: () => ({}), info: '' };
}

// Generate all pages
let count = 0;
calculators.forEach(calc => {
  const html = generateHTML(calc);
  const dirPath = __dirname + '/calc';
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
  fs.writeFileSync(dirPath + '/' + calc.id + '.html', html);
  count++;
  console.log(`✓ Generated calc/${calc.id}.html`);
});

console.log(`\n✅ Generated ${count} investment calculator pages`);
console.log('📝 Next: Create app-calculator.js and update sitemap/index');
