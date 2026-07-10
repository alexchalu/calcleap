#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// High-volume area conversions (real estate, construction, land)
const conversions = [
  // Square Feet conversions
  { from: 'square-feet', to: 'square-meters', name: 'Square Feet to Square Meters', fromUnit: 'sq ft', toUnit: 'sq m', factor: 0.092903 },
  { from: 'square-feet', to: 'acres', name: 'Square Feet to Acres', fromUnit: 'sq ft', toUnit: 'acres', factor: 0.0000229568 },
  { from: 'square-feet', to: 'square-yards', name: 'Square Feet to Square Yards', fromUnit: 'sq ft', toUnit: 'sq yd', factor: 0.111111 },
  
  // Square Meters conversions
  { from: 'square-meters', to: 'square-feet', name: 'Square Meters to Square Feet', fromUnit: 'sq m', toUnit: 'sq ft', factor: 10.7639 },
  { from: 'square-meters', to: 'acres', name: 'Square Meters to Acres', fromUnit: 'sq m', toUnit: 'acres', factor: 0.000247105 },
  { from: 'square-meters', to: 'hectares', name: 'Square Meters to Hectares', fromUnit: 'sq m', toUnit: 'hectares', factor: 0.0001 },
  
  // Acres conversions
  { from: 'acres', to: 'square-feet', name: 'Acres to Square Feet', fromUnit: 'acres', toUnit: 'sq ft', factor: 43560 },
  { from: 'acres', to: 'square-meters', name: 'Acres to Square Meters', fromUnit: 'acres', toUnit: 'sq m', factor: 4046.86 },
  { from: 'acres', to: 'hectares', name: 'Acres to Hectares', fromUnit: 'acres', toUnit: 'hectares', factor: 0.404686 },
  
  // Hectares conversions
  { from: 'hectares', to: 'acres', name: 'Hectares to Acres', fromUnit: 'hectares', toUnit: 'acres', factor: 2.47105 },
  { from: 'hectares', to: 'square-meters', name: 'Hectares to Square Meters', fromUnit: 'hectares', toUnit: 'sq m', factor: 10000 },
  { from: 'hectares', to: 'square-feet', name: 'Hectares to Square Feet', fromUnit: 'hectares', toUnit: 'sq ft', factor: 107639 },
  
  // Square Yards
  { from: 'square-yards', to: 'square-feet', name: 'Square Yards to Square Feet', fromUnit: 'sq yd', toUnit: 'sq ft', factor: 9 },
  { from: 'square-yards', to: 'square-meters', name: 'Square Yards to Square Meters', fromUnit: 'sq yd', toUnit: 'sq m', factor: 0.836127 },
  
  // Additional useful conversions
  { from: 'square-inches', to: 'square-feet', name: 'Square Inches to Square Feet', fromUnit: 'sq in', toUnit: 'sq ft', factor: 0.00694444 },
  { from: 'square-feet', to: 'square-inches', name: 'Square Feet to Square Inches', fromUnit: 'sq ft', toUnit: 'sq in', factor: 144 },
  { from: 'square-kilometers', to: 'square-miles', name: 'Square Kilometers to Square Miles', fromUnit: 'sq km', toUnit: 'sq mi', factor: 0.386102 },
  { from: 'square-miles', to: 'square-kilometers', name: 'Square Miles to Square Kilometers', fromUnit: 'sq mi', toUnit: 'sq km', factor: 2.58999 },
];

function generatePage(conv) {
  const slug = `convert-${conv.from}-to-${conv.to}`;
  const convert = (val) => (val * conv.factor).toFixed(4);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${conv.name} Converter - Free Area Conversion Tool | CalcLeap</title>
    <meta name="description" content="Convert ${conv.fromUnit} to ${conv.toUnit} instantly. Free ${conv.name.toLowerCase()} converter for real estate, construction, and land measurement. Accurate results.">
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
        .info-section ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .info-section ul li { margin-bottom: 0.5rem; }
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
            <p>Free online ${conv.fromUnit} to ${conv.toUnit} converter for real estate and land measurement</p>
        </div>
    </div>

    <div class="main container">
        <!-- Ad Slot 1 -->
        <div class="ad-placeholder">


        </div>

        <div class="converter-box">
            <h2>Convert ${conv.name}</h2>
            <div class="input-group">
                <label for="input-value">Enter ${conv.fromUnit}:</label>
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
            <p>This free online converter helps you quickly convert ${conv.fromUnit} to ${conv.toUnit}. Perfect for:</p>
            <ul>
                <li>Real estate and property measurement</li>
                <li>Construction and building projects</li>
                <li>Land surveying and agricultural planning</li>
                <li>Home improvement and flooring calculations</li>
            </ul>
            
            <h3>Quick Reference Table</h3>
            <div class="table-wrapper">
                <table class="conversion-table">
                    <thead>
                        <tr>
                            <th>${conv.fromUnit}</th>
                            <th>${conv.toUnit}</th>
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
            <h3>More Area Converters & Tools</h3>
            <p>Check out our other conversion and calculation tools:</p>
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
        const factor = ${conv.factor};
        const inputEl = document.getElementById('input-value');
        const resultEl = document.getElementById('result-value');
        const tableEl = document.getElementById('reference-table');
        
        function convert(value) {
            return (value * factor).toFixed(4);
        }
        
        inputEl.addEventListener('input', () => {
            const value = parseFloat(inputEl.value);
            if (isNaN(value)) {
                resultEl.textContent = 'Enter a valid number';
                return;
            }
            const result = convert(value);
            resultEl.textContent = value + ' ${conv.fromUnit} = ' + result + ' ${conv.toUnit}';
        });
        
        // Generate reference table
        const referenceValues = [1, 10, 50, 100, 500, 1000, 5000, 10000];
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
