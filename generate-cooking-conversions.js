#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-volume cooking/kitchen conversions
const conversions = [
  // Temperature
  { from: 'fahrenheit', to: 'celsius', name: 'Fahrenheit to Celsius', category: 'Temperature' },
  { from: 'celsius', to: 'fahrenheit', name: 'Celsius to Fahrenheit', category: 'Temperature' },
  
  // Volume - US to Metric
  { from: 'cups', to: 'ml', name: 'Cups to Milliliters', category: 'Volume' },
  { from: 'cups', to: 'liters', name: 'Cups to Liters', category: 'Volume' },
  { from: 'tablespoons', to: 'ml', name: 'Tablespoons to Milliliters', category: 'Volume' },
  { from: 'teaspoons', to: 'ml', name: 'Teaspoons to Milliliters', category: 'Volume' },
  { from: 'fluid-ounces', to: 'ml', name: 'Fluid Ounces to Milliliters', category: 'Volume' },
  { from: 'pints', to: 'liters', name: 'Pints to Liters', category: 'Volume' },
  { from: 'quarts', to: 'liters', name: 'Quarts to Liters', category: 'Volume' },
  { from: 'gallons', to: 'liters', name: 'Gallons to Liters', category: 'Volume' },
  
  // Volume - Metric to US
  { from: 'ml', to: 'cups', name: 'Milliliters to Cups', category: 'Volume' },
  { from: 'ml', to: 'tablespoons', name: 'Milliliters to Tablespoons', category: 'Volume' },
  { from: 'ml', to: 'teaspoons', name: 'Milliliters to Teaspoons', category: 'Volume' },
  { from: 'liters', to: 'cups', name: 'Liters to Cups', category: 'Volume' },
  { from: 'liters', to: 'gallons', name: 'Liters to Gallons', category: 'Volume' },
  
  // Weight - US to Metric
  { from: 'ounces', to: 'grams', name: 'Ounces to Grams', category: 'Weight' },
  { from: 'pounds', to: 'grams', name: 'Pounds to Grams', category: 'Weight' },
  { from: 'pounds', to: 'kg', name: 'Pounds to Kilograms', category: 'Weight' },
  
  // Weight - Metric to US
  { from: 'grams', to: 'ounces', name: 'Grams to Ounces', category: 'Weight' },
  { from: 'grams', to: 'pounds', name: 'Grams to Pounds', category: 'Weight' },
  { from: 'kg', to: 'pounds', name: 'Kilograms to Pounds', category: 'Weight' },
  
  // Common cooking conversions
  { from: 'cups', to: 'tablespoons', name: 'Cups to Tablespoons', category: 'Volume' },
  { from: 'cups', to: 'teaspoons', name: 'Cups to Teaspoons', category: 'Volume' },
  { from: 'tablespoons', to: 'teaspoons', name: 'Tablespoons to Teaspoons', category: 'Volume' },
  { from: 'tablespoons', to: 'cups', name: 'Tablespoons to Cups', category: 'Volume' },
  { from: 'teaspoons', to: 'tablespoons', name: 'Teaspoons to Tablespoons', category: 'Volume' },
];

// Conversion formulas
const formulas = {
  'fahrenheit-celsius': (f) => ((f - 32) * 5/9).toFixed(2),
  'celsius-fahrenheit': (c) => ((c * 9/5) + 32).toFixed(2),
  'cups-ml': (c) => (c * 236.588).toFixed(2),
  'cups-liters': (c) => (c * 0.236588).toFixed(3),
  'tablespoons-ml': (t) => (t * 14.7868).toFixed(2),
  'teaspoons-ml': (t) => (t * 4.92892).toFixed(2),
  'fluid-ounces-ml': (oz) => (oz * 29.5735).toFixed(2),
  'pints-liters': (p) => (p * 0.473176).toFixed(3),
  'quarts-liters': (q) => (q * 0.946353).toFixed(3),
  'gallons-liters': (g) => (g * 3.78541).toFixed(3),
  'ml-cups': (ml) => (ml / 236.588).toFixed(3),
  'ml-tablespoons': (ml) => (ml / 14.7868).toFixed(2),
  'ml-teaspoons': (ml) => (ml / 4.92892).toFixed(2),
  'liters-cups': (l) => (l / 0.236588).toFixed(2),
  'liters-gallons': (l) => (l / 3.78541).toFixed(3),
  'ounces-grams': (oz) => (oz * 28.3495).toFixed(2),
  'pounds-grams': (lb) => (lb * 453.592).toFixed(2),
  'pounds-kg': (lb) => (lb * 0.453592).toFixed(3),
  'grams-ounces': (g) => (g / 28.3495).toFixed(2),
  'grams-pounds': (g) => (g / 453.592).toFixed(3),
  'kg-pounds': (kg) => (kg / 0.453592).toFixed(2),
  'cups-tablespoons': (c) => (c * 16).toFixed(2),
  'cups-teaspoons': (c) => (c * 48).toFixed(2),
  'tablespoons-teaspoons': (t) => (t * 3).toFixed(2),
  'tablespoons-cups': (t) => (t / 16).toFixed(3),
  'teaspoons-tablespoons': (t) => (t / 3).toFixed(3),
};

const reverseFormulas = {
  'fahrenheit-celsius': 'celsius-fahrenheit',
  'cups-ml': 'ml-cups',
  'cups-liters': 'liters-cups',
  'tablespoons-ml': 'ml-tablespoons',
  'teaspoons-ml': 'ml-teaspoons',
  'fluid-ounces-ml': 'ml-fluid-ounces',
  'pints-liters': 'liters-pints',
  'quarts-liters': 'liters-quarts',
  'gallons-liters': 'liters-gallons',
  'ounces-grams': 'grams-ounces',
  'pounds-grams': 'grams-pounds',
  'pounds-kg': 'kg-pounds',
  'cups-tablespoons': 'tablespoons-cups',
  'cups-teaspoons': 'teaspoons-cups',
  'tablespoons-teaspoons': 'teaspoons-tablespoons',
};

function generatePage(conv) {
  const slug = `convert-${conv.from}-to-${conv.to}`;
  const formulaKey = `${conv.from}-${conv.to}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${conv.name} Converter - Free Cooking Conversion Tool | CalcLeap</title>
    <meta name="description" content="Convert ${conv.from} to ${conv.to} instantly. Free ${conv.name.toLowerCase()} converter for cooking and recipes. Accurate results, easy to use.">
    <link rel="canonical" href="https://calcleap.com/${slug}.html">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .main { padding: 2rem 0; }
        .converter-box { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .converter-box h2 { margin-bottom: 1.5rem; color: #667eea; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input { width: 100%; padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; transition: border 0.3s; }
        .input-group input:focus { outline: none; border-color: #667eea; }
        .result-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 1rem; border-radius: 6px; margin-top: 1rem; }
        .result-box strong { color: #667eea; font-size: 1.2rem; }
        .info-section { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .info-section h3 { color: #667eea; margin-bottom: 1rem; }
        .info-section p { margin-bottom: 1rem; }
        .table-wrapper { overflow-x: auto; }
        .conversion-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .conversion-table th, .conversion-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e6ed; }
        .conversion-table th { background: #f0f4ff; color: #667eea; font-weight: 600; }
        .conversion-table tr:hover { background: #f9fafb; }
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
            <h1>${conv.name} Converter</h1>
            <p>Free online ${conv.from} to ${conv.to} converter for cooking and recipes</p>
        </div>
    </div>

    <div class="main container">
        <!-- Ad Slot 1 -->
        <div class="ad-placeholder">


        </div>

        <div class="converter-box">
            <h2>Convert ${conv.name}</h2>
            <div class="input-group">
                <label for="input-value">Enter ${conv.from}:</label>
                <input type="number" id="input-value" placeholder="Enter value" step="any">
            </div>
            <div class="result-box" id="result">
                <strong>Result: </strong><span id="result-value">Enter a value above</span>
            </div>
        </div>

        <!-- Ad Slot 2 -->
        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>About ${conv.name} Conversion</h3>
            <p>This free online converter helps you quickly convert ${conv.from} to ${conv.to}. Perfect for cooking, baking, and recipe conversions.</p>
            
            <h3>Quick Reference Table</h3>
            <div class="table-wrapper">
                <table class="conversion-table">
                    <thead>
                        <tr>
                            <th>${conv.from.charAt(0).toUpperCase() + conv.from.slice(1)}</th>
                            <th>${conv.to.charAt(0).toUpperCase() + conv.to.slice(1)}</th>
                        </tr>
                    </thead>
                    <tbody id="reference-table"></tbody>
                </table>
            </div>
        </div>

        <!-- Ad Slot 3 -->
        <div class="ad-placeholder">


        </div>

        <div class="info-section">
            <h3>More Cooking Converters</h3>
            <p>Check out our other cooking and kitchen conversion tools:</p>
            <ul>
                <li><a href="index.html">CalcLeap Home - All Tools</a></li>
                <li><a href="https://calcleap.com/">SmartCalc - Financial Calculators</a></li>
                <li><a href="https://calcleap.com/">HealthCalcs - Health & Wellness</a></li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 CalcLeap. Free online tools and calculators.</p>
            <p><a href="index.html">Home</a> | <a href="https://calcleap.com/">SmartCalc</a> | <a href="https://calcleap.com/">HealthCalcs</a></p>
        </div>
    </div>

    <script>
        const formulaKey = '${formulaKey}';
        const formulas = ${JSON.stringify(formulas, null, 2)};
        
        const inputEl = document.getElementById('input-value');
        const resultEl = document.getElementById('result-value');
        const tableEl = document.getElementById('reference-table');
        
        function convert(value) {
            const formula = formulas[formulaKey];
            if (!formula) return 'Error';
            return eval(formula.toString().replace(/^\\(.*?\\)\\s*=>/, 'return ') + '(' + value + ')');
        }
        
        inputEl.addEventListener('input', () => {
            const value = parseFloat(inputEl.value);
            if (isNaN(value)) {
                resultEl.textContent = 'Enter a valid number';
                return;
            }
            const result = convert(value);
            resultEl.textContent = value + ' ${conv.from} = ' + result + ' ${conv.to}';
        });
        
        // Generate reference table
        const referenceValues = [1, 2, 5, 10, 25, 50, 100];
        referenceValues.forEach(val => {
            const row = document.createElement('tr');
            const result = convert(val);
            row.innerHTML = '<td>' + val + '</td><td>' + result + '</td>';
            tableEl.appendChild(row);
        });
    </script>
</body>
</html>`;
}

// Generate all pages
let count = 0;
conversions.forEach(conv => {
  const slug = `convert-${conv.from}-to-${conv.to}`;
  const html = generatePage(conv);
  fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
  count++;
  console.log(`✓ Generated ${slug}.html`);
});

console.log(`\n✅ Generated ${count} cooking conversion pages`);
console.log('📝 Next: Update sitemap.xml and rebuild-index.js to include these pages');
