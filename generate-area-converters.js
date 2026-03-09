#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-search-volume area conversions (real estate, land, construction)
const conversions = [
  // US Real Estate
  { from: 'square-feet', to: 'square-meters', name: 'Square Feet to Square Meters', abbr: ['sq ft', 'm²'] },
  { from: 'square-meters', to: 'square-feet', name: 'Square Meters to Square Feet', abbr: ['m²', 'sq ft'] },
  { from: 'square-feet', to: 'acres', name: 'Square Feet to Acres', abbr: ['sq ft', 'acres'] },
  { from: 'acres', to: 'square-feet', name: 'Acres to Square Feet', abbr: ['acres', 'sq ft'] },
  { from: 'acres', to: 'hectares', name: 'Acres to Hectares', abbr: ['acres', 'ha'] },
  { from: 'hectares', to: 'acres', name: 'Hectares to Acres', abbr: ['ha', 'acres'] },
  { from: 'acres', to: 'square-meters', name: 'Acres to Square Meters', abbr: ['acres', 'm²'] },
  { from: 'square-meters', to: 'acres', name: 'Square Meters to Acres', abbr: ['m²', 'acres'] },
  
  // Metric
  { from: 'square-meters', to: 'hectares', name: 'Square Meters to Hectares', abbr: ['m²', 'ha'] },
  { from: 'hectares', to: 'square-meters', name: 'Hectares to Square Meters', abbr: ['ha', 'm²'] },
  { from: 'square-kilometers', to: 'square-miles', name: 'Square Kilometers to Square Miles', abbr: ['km²', 'mi²'] },
  { from: 'square-miles', to: 'square-kilometers', name: 'Square Miles to Square Kilometers', abbr: ['mi²', 'km²'] },
  
  // Smaller units
  { from: 'square-inches', to: 'square-centimeters', name: 'Square Inches to Square Centimeters', abbr: ['in²', 'cm²'] },
  { from: 'square-centimeters', to: 'square-inches', name: 'Square Centimeters to Square Inches', abbr: ['cm²', 'in²'] },
  { from: 'square-yards', to: 'square-meters', name: 'Square Yards to Square Meters', abbr: ['yd²', 'm²'] },
  { from: 'square-meters', to: 'square-yards', name: 'Square Meters to Square Yards', abbr: ['m²', 'yd²'] },
];

// Conversion formulas (to square meters as base unit)
const formulas = {
  'square-feet-square-meters': (ft) => (ft * 0.092903).toFixed(4),
  'square-meters-square-feet': (m) => (m / 0.092903).toFixed(2),
  'square-feet-acres': (ft) => (ft / 43560).toFixed(6),
  'acres-square-feet': (ac) => (ac * 43560).toFixed(2),
  'acres-hectares': (ac) => (ac * 0.404686).toFixed(4),
  'hectares-acres': (ha) => (ha / 0.404686).toFixed(4),
  'acres-square-meters': (ac) => (ac * 4046.86).toFixed(2),
  'square-meters-acres': (m) => (m / 4046.86).toFixed(6),
  'square-meters-hectares': (m) => (m / 10000).toFixed(6),
  'hectares-square-meters': (ha) => (ha * 10000).toFixed(2),
  'square-kilometers-square-miles': (km) => (km * 0.386102).toFixed(4),
  'square-miles-square-kilometers': (mi) => (mi / 0.386102).toFixed(4),
  'square-inches-square-centimeters': (inch) => (inch * 6.4516).toFixed(4),
  'square-centimeters-square-inches': (cm) => (cm / 6.4516).toFixed(4),
  'square-yards-square-meters': (yd) => (yd * 0.836127).toFixed(4),
  'square-meters-square-yards': (m) => (m / 0.836127).toFixed(4),
};

function generatePage(conv) {
  const slug = `convert-${conv.from}-to-${conv.to}`;
  const formulaKey = `${conv.from}-${conv.to}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${conv.name} Converter - Free Area Conversion Tool | ToolPulse</title>
    <meta name="description" content="Convert ${conv.from.replace(/-/g, ' ')} to ${conv.to.replace(/-/g, ' ')} instantly. Free ${conv.name.toLowerCase()} converter for real estate, land measurement, and construction. Accurate results.">
    <link rel="canonical" href="https://alexchalu.github.io/toolpulse/${slug}.html">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .main { padding: 2rem 0; }
        .converter-box { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
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
        .info-section ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .info-section li { margin-bottom: 0.5rem; }
        .table-wrapper { overflow-x: auto; }
        .conversion-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .conversion-table th, .conversion-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e6ed; }
        .conversion-table th { background: #f0f4ff; color: #667eea; font-weight: 600; }
        .conversion-table tr:hover { background: #f9fafb; }
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
            <h1>${conv.name} Converter</h1>
            <p>Free online ${conv.from.replace(/-/g, ' ')} to ${conv.to.replace(/-/g, ' ')} converter for real estate and land measurement</p>
        </div>
    </div>

    <div class="main container">
        <!-- Ad Slot 1 -->
        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="converter-box">
            <h2>Convert ${conv.name}</h2>
            <div class="input-group">
                <label for="input-value">Enter ${conv.from.replace(/-/g, ' ')} (${conv.abbr[0]}):</label>
                <input type="number" id="input-value" placeholder="Enter value" step="any">
            </div>
            <div class="result-box" id="result">
                <strong>Result: </strong><span id="result-value">Enter a value above</span>
            </div>
        </div>

        <!-- Ad Slot 2 -->
        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567891" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-section">
            <h3>About ${conv.name} Conversion</h3>
            <p>This free online converter helps you quickly convert ${conv.from.replace(/-/g, ' ')} to ${conv.to.replace(/-/g, ' ')}. Perfect for:</p>
            <ul>
                <li>Real estate listings and property measurements</li>
                <li>Land surveying and lot size calculations</li>
                <li>Construction and building planning</li>
                <li>Gardening and landscaping projects</li>
                <li>International property comparisons</li>
            </ul>
            
            <h3>Quick Reference Table</h3>
            <div class="table-wrapper">
                <table class="conversion-table">
                    <thead>
                        <tr>
                            <th>${conv.abbr[0]}</th>
                            <th>${conv.abbr[1]}</th>
                        </tr>
                    </thead>
                    <tbody id="reference-table"></tbody>
                </table>
            </div>
        </div>

        <!-- Ad Slot 3 -->
        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567892" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-section">
            <h3>More Area Converters</h3>
            <p>Check out our other area and land measurement conversion tools:</p>
            <ul>
                <li><a href="convert-square-feet-to-square-meters.html">Square Feet to Square Meters</a></li>
                <li><a href="convert-acres-to-hectares.html">Acres to Hectares</a></li>
                <li><a href="convert-square-meters-to-square-feet.html">Square Meters to Square Feet</a></li>
                <li><a href="index.html">ToolPulse Home - All Tools</a></li>
                <li><a href="https://alexchalu.github.io/smartcalc/">SmartCalc - Financial Calculators</a></li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 ToolPulse. Free online tools and calculators.</p>
            <p><a href="index.html">Home</a> | <a href="https://alexchalu.github.io/smartcalc/">SmartCalc</a> | <a href="https://alexchalu.github.io/healthcalcs/">HealthCalcs</a></p>
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
            resultEl.textContent = value + ' ${conv.abbr[0]} = ' + result + ' ${conv.abbr[1]}';
        });
        
        // Generate reference table
        const referenceValues = [1, 10, 50, 100, 500, 1000, 5000];
        referenceValues.forEach(val => {
            const row = document.createElement('tr');
            const result = convert(val);
            row.innerHTML = '<td>' + val.toLocaleString() + '</td><td>' + parseFloat(result).toLocaleString() + '</td>';
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

console.log(`\n✅ Generated ${count} area conversion pages`);
console.log('📝 Next: Update sitemap.xml and rebuild-index.js to include these pages');
