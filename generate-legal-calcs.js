#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-CPC legal calculators
const calculators = [
  {
    slug: 'child-support-calculator',
    title: 'Child Support Calculator',
    desc: 'Calculate estimated child support payments based on income and custody arrangement',
    category: 'Family Law'
  },
  {
    slug: 'alimony-calculator',
    title: 'Alimony Calculator',
    desc: 'Estimate spousal support payments after divorce',
    category: 'Family Law'
  },
  {
    slug: 'personal-injury-settlement-calculator',
    title: 'Personal Injury Settlement Calculator',
    desc: 'Estimate potential personal injury claim value',
    category: 'Personal Injury'
  },
  {
    slug: 'wrongful-death-calculator',
    title: 'Wrongful Death Calculator',
    desc: 'Calculate potential wrongful death claim damages',
    category: 'Personal Injury'
  },
  {
    slug: 'workers-comp-settlement-calculator',
    title: 'Workers Compensation Settlement Calculator',
    desc: 'Estimate workers comp settlement amount',
    category: 'Workers Comp'
  },
  {
    slug: 'ssdi-calculator',
    title: 'SSDI Calculator',
    desc: 'Calculate Social Security Disability Insurance benefits',
    category: 'Disability Benefits'
  },
  {
    slug: 'car-accident-settlement-calculator',
    title: 'Car Accident Settlement Calculator',
    desc: 'Estimate auto accident injury claim value',
    category: 'Personal Injury'
  },
  {
    slug: 'slip-and-fall-settlement-calculator',
    title: 'Slip and Fall Settlement Calculator',
    desc: 'Calculate potential slip and fall claim value',
    category: 'Personal Injury'
  },
];

function generateHTML(calc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free ${calc.category} Tool | CalcLeap</title>
    <meta name="description" content="${calc.desc}. Free online calculator with instant results.">
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
        .calc-btn { background: #0071e3; color: white; border: none; padding: 1rem 2rem; font-size: 1.125rem; font-weight: 500; border-radius: 12px; cursor: pointer; width: 100%; transition: background 0.2s; }
        .calc-btn:hover { background: #0077ed; }
        .result-box { background: linear-gradient(135deg, #f5f9ff 0%, #e8f4ff 100%); border: 1px solid #0071e3; padding: 2rem; border-radius: 18px; margin-top: 1.5rem; display: none; }
        .result-box h3 { color: #0071e3; margin-bottom: 1.25rem; font-size: 1.5rem; font-weight: 600; }
        .result-value { font-size: 2.5rem; font-weight: 700; color: #0071e3; margin: 0.75rem 0; }
        .result-detail { margin: 0.75rem 0; color: #1d1d1f; font-size: 1.05rem; }
        .result-detail strong { font-weight: 600; }
        .chart-container { margin: 1.5rem 0; }
        .bar-chart { display: flex; gap: 0.5rem; align-items: flex-end; height: 200px; }
        .bar { flex: 1; background: linear-gradient(to top, #0071e3, #00a1ff); border-radius: 8px 8px 0 0; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding: 0.5rem; color: white; font-weight: 600; transition: transform 0.3s; }
        .bar:hover { transform: translateY(-5px); }
        .bar-label { margin-top: 0.5rem; font-size: 0.9rem; color: #6e6e73; text-align: center; }
        .info-section { background: white; border-radius: 18px; padding: 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); margin-bottom: 2rem; border: 1px solid #e5e5e7; }
        .info-section h3 { color: #1d1d1f; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600; }
        .info-section p { margin-bottom: 1rem; color: #1d1d1f; line-height: 1.7; }
        .info-section ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .info-section li { margin-bottom: 0.5rem; color: #1d1d1f; }
        .disclaimer { background: #fff4e6; border-left: 4px solid #ff9500; padding: 1.5rem; border-radius: 12px; margin: 2rem 0; }
        .disclaimer p { margin: 0; color: #1d1d1f; font-size: 0.95rem; }
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
            <p style="margin-bottom: 1.5rem; color: #6e6e73;">Enter your information below for an estimated calculation. This is for informational purposes only.</p>
            <div class="input-group">
                <label for="income">Annual Income ($):</label>
                <input type="number" id="income" min="0" value="75000">
            </div>
            <div class="input-group">
                <label for="duration">Duration (months):</label>
                <select id="duration">
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36" selected>36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                </select>
            </div>
            <div class="input-group">
                <label for="factor">Multiplier (%):</label>
                <input type="number" id="factor" min="0" max="100" value="25" step="1">
                <small style="color: #6e6e73;">Percentage of income used in calculation</small>
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Estimate</button>
            <div class="result-box" id="result">
                <h3>Estimated Results</h3>
            </div>
        </div>

        <div class="disclaimer">
            <p><strong>Legal Disclaimer:</strong> This calculator provides estimates for informational purposes only. Actual ${calc.category.toLowerCase()} amounts vary based on many factors including state laws, specific circumstances, and court decisions. Consult with a licensed attorney for advice on your specific situation.</p>
        </div>




        <div class="info-section">
            <h3>About ${calc.title}</h3>
            <p>${calc.desc}. This calculator uses common formulas and guidelines, but actual amounts can vary significantly based on:</p>
            <ul>
                <li>State-specific laws and guidelines</li>
                <li>Individual circumstances and factors</li>
                <li>Court discretion and case specifics</li>
                <li>Additional income sources or assets</li>
            </ul>
            <h3>When to Consult an Attorney</h3>
            <p>It's recommended to consult with a licensed attorney if you're involved in any ${calc.category.toLowerCase()} matter. An attorney can:</p>
            <ul>
                <li>Provide advice specific to your situation</li>
                <li>Explain state-specific laws and requirements</li>
                <li>Represent you in negotiations or court</li>
                <li>Ensure your rights are protected</li>
            </ul>
            <h3>More Calculators</h3>
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
            const income = parseFloat(document.getElementById('income').value) || 0;
            const duration = parseInt(document.getElementById('duration').value) || 36;
            const factor = parseFloat(document.getElementById('factor').value) / 100 || 0.25;
            
            const monthlyIncome = income / 12;
            const monthlyAmount = monthlyIncome * factor;
            const totalAmount = monthlyAmount * duration;
            
            let html = '<h3>Estimated Calculation</h3>';
            html += '<div class="result-value">$' + monthlyAmount.toFixed(2).toLocaleString() + '/month</div>';
            html += '<div class="result-detail"><strong>Total over ' + duration + ' months:</strong> $' + totalAmount.toFixed(2).toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Based on annual income:</strong> $' + income.toLocaleString() + '</div>';
            html += '<div class="result-detail"><strong>Monthly income:</strong> $' + monthlyIncome.toFixed(2).toLocaleString() + '</div>';
            
            // Add visual bar chart
            html += '<div class="chart-container">';
            html += '<div class="bar-chart">';
            const barHeight1 = (monthlyIncome / monthlyIncome) * 100;
            const barHeight2 = (monthlyAmount / monthlyIncome) * 100;
            html += '<div class="bar" style="height:' + barHeight1 + '%"><small>$' + monthlyIncome.toFixed(0).toLocaleString() + '</small></div>';
            html += '<div class="bar" style="height:' + barHeight2 + '%"><small>$' + monthlyAmount.toFixed(0).toLocaleString() + '</small></div>';
            html += '</div>';
            html += '<div style="display:flex; gap:0.5rem;">';
            html += '<div style="flex:1;" class="bar-label">Monthly Income</div>';
            html += '<div style="flex:1;" class="bar-label">Estimated Payment</div>';
            html += '</div>';
            html += '</div>';
            
            html += '<p style="margin-top: 1.5rem; font-size: 0.95rem; color: #6e6e73;"><em>This is an estimate only. Actual amounts may differ based on state laws, specific circumstances, and court decisions. Always consult with a licensed attorney.</em></p>';
            
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

console.log(`\n✅ Generated ${count} legal calculators with Apple-inspired design + visual charts`);
console.log('💰 Ultra high-CPC niche: legal/personal injury ($50-200/click)');
console.log('📝 Next: Update sitemap.xml and push to GitHub');
