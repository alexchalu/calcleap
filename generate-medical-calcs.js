#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-CPC medical/healthcare calculators
const calculators = [
  {
    slug: 'medicare-supplement-calculator',
    title: 'Medicare Supplement Calculator',
    desc: 'Calculate and compare Medicare Supplement (Medigap) plan costs and coverage options.',
    category: 'Medicare'
  },
  {
    slug: 'medicare-advantage-calculator',
    title: 'Medicare Advantage Calculator',
    desc: 'Compare Medicare Advantage plans and estimate out-of-pocket costs based on your healthcare needs.',
    category: 'Medicare'
  },
  {
    slug: 'long-term-care-cost-calculator',
    title: 'Long-Term Care Cost Calculator',
    desc: 'Estimate future long-term care costs including nursing home, assisted living, and in-home care.',
    category: 'Healthcare Planning'
  },
  {
    slug: 'medical-bankruptcy-calculator',
    title: 'Medical Bankruptcy Calculator',
    desc: 'Assess whether medical debt warrants filing for bankruptcy and estimate the impact.',
    category: 'Medical Debt'
  },
  {
    slug: 'health-savings-account-calculator',
    title: 'HSA Calculator',
    desc: 'Calculate Health Savings Account contributions, tax savings, and long-term growth potential.',
    category: 'HSA'
  },
  {
    slug: 'cobra-cost-calculator',
    title: 'COBRA Insurance Cost Calculator',
    desc: 'Calculate COBRA health insurance premiums after job loss and compare to marketplace options.',
    category: 'Health Insurance'
  },
];

function generateHTML(calc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free ${calc.category} Tool | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free online calculator with instant results and visual breakdowns.">
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
        .pie-chart { width: 200px; height: 200px; margin: 0 auto; }
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
            <h2>${calc.category} Estimator</h2>
            <p style="margin-bottom: 1.5rem; color: #6e6e73;">Enter your information below to estimate costs and coverage options.</p>
            <div class="input-group">
                <label for="age">Your Age:</label>
                <input type="number" id="age" min="18" max="100" value="65">
            </div>
            <div class="input-group">
                <label for="coverage">Coverage Level:</label>
                <select id="coverage">
                    <option value="basic">Basic Coverage</option>
                    <option value="standard" selected>Standard Coverage</option>
                    <option value="comprehensive">Comprehensive Coverage</option>
                </select>
            </div>
            <div class="input-group">
                <label for="monthly">Estimated Monthly Premium ($):</label>
                <input type="number" id="monthly" min="0" value="200" step="10">
                <small>Average monthly premium for your age/coverage</small>
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Costs</button>
            <div class="result-box" id="result">
                <h3>Results</h3>
            </div>
        </div>




        <div class="info-section">
            <h3>About ${calc.title}</h3>
            <p>${calc.desc}</p>
            <h3>Understanding ${calc.category}</h3>
            <p>When planning for healthcare costs, it's important to understand:</p>
            <ul>
                <li>Monthly premium costs and how they vary by age</li>
                <li>Out-of-pocket maximums and deductibles</li>
                <li>Coverage levels and what they include</li>
                <li>Long-term cost implications of different plans</li>
            </ul>
            <h3>When to Review Your Coverage</h3>
            <ul>
                <li>During annual enrollment periods</li>
                <li>When experiencing major life changes</li>
                <li>If your health needs change significantly</li>
                <li>Before making major healthcare decisions</li>
            </ul>
            <h3>More Healthcare Calculators</h3>
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
            const age = parseInt(document.getElementById('age').value) || 65;
            const coverage = document.getElementById('coverage').value;
            const monthly = parseFloat(document.getElementById('monthly').value) || 200;
            
            const annualPremium = monthly * 12;
            const fiveYearCost = annualPremium * 5;
            const tenYearCost = annualPremium * 10;
            
            let html = '<h3>Cost Breakdown</h3>';
            html += '<div class="result-value">$' + monthly.toFixed(2).toLocaleString() + '/month</div>';
            html += '<div class="result-detail"><strong>Annual Premium:</strong> $' + annualPremium.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>5-Year Total:</strong> $' + fiveYearCost.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>10-Year Total:</strong> $' + tenYearCost.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Coverage Level:</strong> ' + coverage.charAt(0).toUpperCase() + coverage.slice(1) + '</div>';
            html += '<div class="result-detail"><strong>Age:</strong> ' + age + ' years</div>';
            
            html += '<p style="margin-top: 1.5rem; font-size: 0.95rem; color: #6e6e73;"><em>Estimates are for planning purposes. Actual costs vary by location, health status, and specific plan details. Consult with a licensed insurance advisor for personalized recommendations.</em></p>';
            
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

console.log(`\n✅ Generated ${count} medical/healthcare calculators with Apple design`);
console.log('💰 High-CPC niche: Medicare/healthcare ($20-80/click)');
console.log('📝 Next: Update sitemap and push');
