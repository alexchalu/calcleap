#!/usr/bin/env node
/**
 * Generate hundreds of unit conversion pages
 * Each targets a specific "X to Y" search query
 * e.g., "pounds to kilograms", "fahrenheit to celsius"
 */
const fs = require('fs');
const AD = 'ca-pub-3112605892426625';
const BASE = 'https://alexchalu.github.io/toolpulse';

if (!fs.existsSync(__dirname + '/convert')) fs.mkdirSync(__dirname + '/convert');

function convPage(slug, title, desc, fromUnit, toUnit, factor, formula, reverseFormula, table) {
    const tableRows = table.map(([from, to]) => 
        `<tr><td>${from} ${fromUnit}</td><td>${to} ${toUnit}</td></tr>`
    ).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Free Converter | ToolPulse</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${BASE}/convert/${slug}.html">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD}" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${title}","description":"${desc}","url":"${BASE}/convert/${slug}.html","applicationCategory":"UtilityApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<style>
:root{--bg:#0a0e1a;--s:#111827;--s2:#1f2937;--b:#374151;--t:#f3f4f6;--m:#9ca3af;--a:#10b981;--a2:#059669}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--t);line-height:1.6}
header{background:var(--s);border-bottom:1px solid var(--b);padding:.75rem 1.5rem}
.hi{max-width:800px;margin:0 auto;display:flex;align-items:center;gap:1rem}
.logo{font-size:1.2rem;font-weight:800;color:var(--a);text-decoration:none}
main{max-width:800px;margin:0 auto;padding:2rem 1.5rem}
h1{font-size:1.6rem;margin-bottom:.5rem}
.sub{color:var(--m);margin-bottom:1.5rem}
.converter{background:var(--s);border:1px solid var(--b);border-radius:12px;padding:2rem;text-align:center}
.conv-row{display:flex;align-items:center;gap:1rem;justify-content:center;flex-wrap:wrap}
.conv-input{padding:.8rem 1rem;background:var(--s2);border:1px solid var(--b);border-radius:8px;color:var(--t);font-size:1.5rem;font-weight:700;width:200px;text-align:center;outline:none}
.conv-input:focus{border-color:var(--a)}
.conv-label{font-size:.9rem;color:var(--m)}
.conv-result{font-size:2.5rem;font-weight:800;color:var(--a);margin:1.5rem 0 .5rem}
.conv-result-label{color:var(--m);font-size:.9rem}
.swap-btn{background:var(--a);color:#fff;border:none;border-radius:50%;width:40px;height:40px;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center}
.swap-btn:hover{background:var(--a2)}
.ad{max-width:800px;margin:1rem auto;padding:0 1.5rem}
table{width:100%;border-collapse:collapse;margin-top:1rem}
th,td{padding:.5rem .75rem;text-align:left;border-bottom:1px solid var(--b);font-size:.85rem}
th{color:var(--m);font-weight:600;font-size:.75rem;text-transform:uppercase}
.info{margin-top:2rem;background:var(--s);border:1px solid var(--b);border-radius:12px;padding:1.5rem}
.info h2{font-size:1.1rem;margin-bottom:.75rem}
.info p{color:var(--m);font-size:.85rem;line-height:1.7}
.related{margin-top:2rem}
.related h2{font-size:1.1rem;margin-bottom:.75rem}
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.5rem}
.rlink{background:var(--s);border:1px solid var(--b);border-radius:8px;padding:.75rem;text-decoration:none;color:var(--t);font-size:.8rem;transition:.2s}
.rlink:hover{border-color:var(--a)}
footer{text-align:center;padding:1.5rem;color:var(--m);font-size:.8rem;border-top:1px solid var(--b);margin-top:2rem}
footer a{color:var(--a);text-decoration:none}
@media(max-width:600px){.conv-row{flex-direction:column}.conv-input{width:100%}}
</style>
</head>
<body>
<header><div class="hi"><a href="../index.html" class="logo">🔧 ToolPulse</a></div></header>
<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
<main>
<h1>${title}</h1>
<p class="sub">${desc}</p>
<div class="converter">
<div class="conv-row">
<div><input type="number" class="conv-input" id="fromVal" value="1" oninput="convert()"><div class="conv-label">${fromUnit}</div></div>
<button class="swap-btn" onclick="swap()">⇄</button>
<div><input type="number" class="conv-input" id="toVal" oninput="reverse()" readonly><div class="conv-label">${toUnit}</div></div>
</div>
<div class="conv-result" id="result"></div>
<div class="conv-result-label" id="resultLabel"></div>
</div>
<div class="ad" style="padding:0;margin-top:1.5rem"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
<div class="info">
<h2>Conversion Table</h2>
<table><thead><tr><th>${fromUnit}</th><th>${toUnit}</th></tr></thead><tbody>${tableRows}</tbody></table>
</div>
</main>
<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
<footer><a href="../index.html">ToolPulse</a> · <a href="https://alexchalu.github.io/smartcalc/">SmartCalc</a></footer>
<script>
const fromEl=document.getElementById('fromVal'),toEl=document.getElementById('toVal');
const resEl=document.getElementById('result'),lblEl=document.getElementById('resultLabel');
function fwd(v){${formula}}
function rev(v){${reverseFormula}}
function convert(){const v=parseFloat(fromEl.value)||0;const r=fwd(v);toEl.value=r%1===0?r:r.toFixed(6);resEl.textContent=toEl.value;lblEl.textContent=v+' ${fromUnit} = '+toEl.value+' ${toUnit}'}
function reverse(){const v=parseFloat(toEl.value)||0;const r=rev(v);fromEl.value=r%1===0?r:r.toFixed(6)}
function swap(){const t=fromEl.value;fromEl.value=toEl.value;toEl.value=t;convert()}
convert();
</script>
</body>
</html>`;
}

const conversions = [
    // TEMPERATURE
    { slug: 'fahrenheit-to-celsius', title: 'Fahrenheit to Celsius Converter', desc: 'Convert Fahrenheit to Celsius. Quick, free temperature conversion with formula and reference table.',
      from: 'Fahrenheit (°F)', to: 'Celsius (°C)', formula: 'return (v-32)*5/9', reverse: 'return v*9/5+32',
      table: [[32,0],[50,10],[68,20],[72,22.2],[77,25],[86,30],[98.6,37],[100,37.8],[212,100]] },
    { slug: 'celsius-to-fahrenheit', title: 'Celsius to Fahrenheit Converter', desc: 'Convert Celsius to Fahrenheit instantly. Free temperature converter with formula and chart.',
      from: 'Celsius (°C)', to: 'Fahrenheit (°F)', formula: 'return v*9/5+32', reverse: 'return (v-32)*5/9',
      table: [[-40,-40],[0,32],[10,50],[20,68],[25,77],[30,86],[37,98.6],[100,212]] },
    { slug: 'celsius-to-kelvin', title: 'Celsius to Kelvin Converter', desc: 'Convert Celsius to Kelvin. Simple temperature conversion for science and engineering.',
      from: 'Celsius (°C)', to: 'Kelvin (K)', formula: 'return v+273.15', reverse: 'return v-273.15',
      table: [[-273.15,0],[-40,233.15],[0,273.15],[20,293.15],[37,310.15],[100,373.15]] },
    // WEIGHT
    { slug: 'pounds-to-kilograms', title: 'Pounds to Kilograms Converter', desc: 'Convert pounds (lbs) to kilograms (kg). Free weight converter with conversion table.',
      from: 'Pounds (lbs)', to: 'Kilograms (kg)', formula: 'return v*0.453592', reverse: 'return v/0.453592',
      table: [[1,0.45],[5,2.27],[10,4.54],[25,11.34],[50,22.68],[100,45.36],[150,68.04],[200,90.72],[250,113.4]] },
    { slug: 'kilograms-to-pounds', title: 'Kilograms to Pounds Converter', desc: 'Convert kilograms (kg) to pounds (lbs). Quick and free weight conversion.',
      from: 'Kilograms (kg)', to: 'Pounds (lbs)', formula: 'return v*2.20462', reverse: 'return v/2.20462',
      table: [[1,2.2],[5,11],[10,22],[25,55.1],[50,110.2],[75,165.3],[100,220.5]] },
    { slug: 'ounces-to-grams', title: 'Ounces to Grams Converter', desc: 'Convert ounces (oz) to grams (g). Essential for cooking and shipping weight calculations.',
      from: 'Ounces (oz)', to: 'Grams (g)', formula: 'return v*28.3495', reverse: 'return v/28.3495',
      table: [[0.5,14.17],[1,28.35],[2,56.7],[4,113.4],[8,226.8],[16,453.6]] },
    { slug: 'grams-to-ounces', title: 'Grams to Ounces Converter', desc: 'Convert grams to ounces. Free weight converter for cooking, shipping, and more.',
      from: 'Grams (g)', to: 'Ounces (oz)', formula: 'return v/28.3495', reverse: 'return v*28.3495',
      table: [[10,0.35],[25,0.88],[50,1.76],[100,3.53],[250,8.82],[500,17.64],[1000,35.27]] },
    { slug: 'stones-to-pounds', title: 'Stones to Pounds Converter', desc: 'Convert stones to pounds. Used in UK weight measurements.',
      from: 'Stones', to: 'Pounds (lbs)', formula: 'return v*14', reverse: 'return v/14',
      table: [[1,14],[5,70],[8,112],[10,140],[12,168],[14,196],[16,224],[20,280]] },
    { slug: 'stones-to-kilograms', title: 'Stones to Kilograms Converter', desc: 'Convert stones to kilograms. UK to metric weight conversion.',
      from: 'Stones', to: 'Kilograms (kg)', formula: 'return v*6.35029', reverse: 'return v/6.35029',
      table: [[1,6.35],[5,31.75],[8,50.8],[10,63.5],[12,76.2],[14,88.9],[16,101.6]] },
    // LENGTH
    { slug: 'inches-to-centimeters', title: 'Inches to Centimeters Converter', desc: 'Convert inches to centimeters (cm). Quick length conversion with reference table.',
      from: 'Inches', to: 'Centimeters (cm)', formula: 'return v*2.54', reverse: 'return v/2.54',
      table: [[1,2.54],[2,5.08],[3,7.62],[6,15.24],[12,30.48],[24,60.96],[36,91.44]] },
    { slug: 'centimeters-to-inches', title: 'Centimeters to Inches Converter', desc: 'Convert centimeters to inches. Metric to imperial length conversion.',
      from: 'Centimeters (cm)', to: 'Inches', formula: 'return v/2.54', reverse: 'return v*2.54',
      table: [[1,0.39],[5,1.97],[10,3.94],[20,7.87],[30,11.81],[50,19.69],[100,39.37]] },
    { slug: 'feet-to-meters', title: 'Feet to Meters Converter', desc: 'Convert feet to meters. Quick and accurate length conversion.',
      from: 'Feet', to: 'Meters', formula: 'return v*0.3048', reverse: 'return v/0.3048',
      table: [[1,0.3],[3,0.91],[5,1.52],[6,1.83],[10,3.05],[20,6.1],[50,15.24],[100,30.48]] },
    { slug: 'meters-to-feet', title: 'Meters to Feet Converter', desc: 'Convert meters to feet. Metric to imperial length converter.',
      from: 'Meters', to: 'Feet', formula: 'return v/0.3048', reverse: 'return v*0.3048',
      table: [[1,3.28],[2,6.56],[3,9.84],[5,16.4],[10,32.81],[20,65.62],[50,164.04],[100,328.08]] },
    { slug: 'miles-to-kilometers', title: 'Miles to Kilometers Converter', desc: 'Convert miles to kilometers (km). Quick distance conversion for travel and running.',
      from: 'Miles', to: 'Kilometers (km)', formula: 'return v*1.60934', reverse: 'return v/1.60934',
      table: [[0.5,0.8],[1,1.61],[3,4.83],[5,8.05],[10,16.09],[26.2,42.16],[50,80.47],[100,160.93]] },
    { slug: 'kilometers-to-miles', title: 'Kilometers to Miles Converter', desc: 'Convert kilometers to miles. Metric to imperial distance conversion.',
      from: 'Kilometers (km)', to: 'Miles', formula: 'return v/1.60934', reverse: 'return v*1.60934',
      table: [[1,0.62],[5,3.11],[10,6.21],[21.1,13.11],[42.2,26.22],[50,31.07],[100,62.14]] },
    { slug: 'yards-to-meters', title: 'Yards to Meters Converter', desc: 'Convert yards to meters. Common for sports and construction measurements.',
      from: 'Yards', to: 'Meters', formula: 'return v*0.9144', reverse: 'return v/0.9144',
      table: [[1,0.91],[5,4.57],[10,9.14],[25,22.86],[50,45.72],[100,91.44]] },
    { slug: 'millimeters-to-inches', title: 'Millimeters to Inches Converter', desc: 'Convert millimeters (mm) to inches. Precision measurement conversion.',
      from: 'Millimeters (mm)', to: 'Inches', formula: 'return v/25.4', reverse: 'return v*25.4',
      table: [[1,0.039],[5,0.197],[10,0.394],[25,0.984],[50,1.969],[100,3.937]] },
    // AREA
    { slug: 'square-feet-to-square-meters', title: 'Square Feet to Square Meters Converter', desc: 'Convert sq ft to sq m. Essential for real estate and property measurements.',
      from: 'Square Feet (sq ft)', to: 'Square Meters (m²)', formula: 'return v*0.092903', reverse: 'return v/0.092903',
      table: [[100,9.29],[200,18.58],[500,46.45],[1000,92.9],[1500,139.35],[2000,185.81],[5000,464.52]] },
    { slug: 'acres-to-hectares', title: 'Acres to Hectares Converter', desc: 'Convert acres to hectares. Land area conversion for real estate and agriculture.',
      from: 'Acres', to: 'Hectares', formula: 'return v*0.404686', reverse: 'return v/0.404686',
      table: [[0.25,0.1],[0.5,0.2],[1,0.4],[5,2.02],[10,4.05],[40,16.19],[100,40.47],[640,259]] },
    // VOLUME
    { slug: 'gallons-to-liters', title: 'Gallons to Liters Converter', desc: 'Convert US gallons to liters. Volume conversion for cooking, fuel, and liquids.',
      from: 'Gallons (US)', to: 'Liters', formula: 'return v*3.78541', reverse: 'return v/3.78541',
      table: [[0.5,1.89],[1,3.79],[2,7.57],[5,18.93],[10,37.85],[20,75.71],[50,189.27]] },
    { slug: 'liters-to-gallons', title: 'Liters to Gallons Converter', desc: 'Convert liters to US gallons. Quick volume conversion.',
      from: 'Liters', to: 'Gallons (US)', formula: 'return v/3.78541', reverse: 'return v*3.78541',
      table: [[1,0.26],[2,0.53],[5,1.32],[10,2.64],[20,5.28],[50,13.21],[100,26.42]] },
    { slug: 'cups-to-milliliters', title: 'Cups to Milliliters Converter', desc: 'Convert cups to milliliters (mL). Essential cooking and baking measurement conversion.',
      from: 'Cups', to: 'Milliliters (mL)', formula: 'return v*236.588', reverse: 'return v/236.588',
      table: [[0.25,59.15],[0.33,78.07],[0.5,118.29],[0.75,177.44],[1,236.59],[1.5,354.88],[2,473.18],[4,946.35]] },
    { slug: 'tablespoons-to-teaspoons', title: 'Tablespoons to Teaspoons Converter', desc: 'Convert tablespoons to teaspoons. Quick kitchen measurement conversion.',
      from: 'Tablespoons', to: 'Teaspoons', formula: 'return v*3', reverse: 'return v/3',
      table: [[0.5,1.5],[1,3],[1.5,4.5],[2,6],[3,9],[4,12],[5,15]] },
    { slug: 'fluid-ounces-to-milliliters', title: 'Fluid Ounces to Milliliters Converter', desc: 'Convert fluid ounces (fl oz) to milliliters (mL). Liquid volume conversion.',
      from: 'Fluid Ounces (fl oz)', to: 'Milliliters (mL)', formula: 'return v*29.5735', reverse: 'return v/29.5735',
      table: [[1,29.57],[2,59.15],[4,118.29],[6,177.44],[8,236.59],[12,354.88],[16,473.18],[32,946.35]] },
    // SPEED
    { slug: 'mph-to-kph', title: 'MPH to KPH Converter', desc: 'Convert miles per hour to kilometers per hour. Speed conversion for driving and sports.',
      from: 'Miles/hour (mph)', to: 'Km/hour (kph)', formula: 'return v*1.60934', reverse: 'return v/1.60934',
      table: [[5,8.05],[10,16.09],[25,40.23],[30,48.28],[55,88.51],[60,96.56],[65,104.61],[70,112.65],[75,120.7],[100,160.93]] },
    { slug: 'kph-to-mph', title: 'KPH to MPH Converter', desc: 'Convert kilometers per hour to miles per hour. Speed conversion.',
      from: 'Km/hour (kph)', to: 'Miles/hour (mph)', formula: 'return v/1.60934', reverse: 'return v*1.60934',
      table: [[10,6.21],[20,12.43],[30,18.64],[50,31.07],[80,49.71],[100,62.14],[120,74.56],[130,80.78]] },
    // DATA
    { slug: 'mb-to-gb', title: 'MB to GB Converter', desc: 'Convert megabytes to gigabytes. Digital storage conversion.',
      from: 'Megabytes (MB)', to: 'Gigabytes (GB)', formula: 'return v/1024', reverse: 'return v*1024',
      table: [[256,0.25],[512,0.5],[1024,1],[2048,2],[4096,4],[8192,8],[16384,16]] },
    { slug: 'gb-to-tb', title: 'GB to TB Converter', desc: 'Convert gigabytes to terabytes. Storage size conversion.',
      from: 'Gigabytes (GB)', to: 'Terabytes (TB)', formula: 'return v/1024', reverse: 'return v*1024',
      table: [[128,0.125],[256,0.25],[500,0.49],[512,0.5],[1000,0.98],[1024,1],[2048,2],[4096,4]] },
    { slug: 'kb-to-mb', title: 'KB to MB Converter', desc: 'Convert kilobytes to megabytes. File size conversion.',
      from: 'Kilobytes (KB)', to: 'Megabytes (MB)', formula: 'return v/1024', reverse: 'return v*1024',
      table: [[256,0.25],[512,0.5],[1024,1],[2048,2],[5120,5],[10240,10]] },
    // ENERGY
    { slug: 'calories-to-joules', title: 'Calories to Joules Converter', desc: 'Convert calories to joules. Energy unit conversion for science and nutrition.',
      from: 'Calories (cal)', to: 'Joules (J)', formula: 'return v*4.184', reverse: 'return v/4.184',
      table: [[1,4.18],[10,41.84],[50,209.2],[100,418.4],[500,2092],[1000,4184],[2000,8368]] },
    { slug: 'watts-to-horsepower', title: 'Watts to Horsepower Converter', desc: 'Convert watts to horsepower. Power conversion for engines and motors.',
      from: 'Watts', to: 'Horsepower (hp)', formula: 'return v/745.7', reverse: 'return v*745.7',
      table: [[100,0.13],[250,0.34],[500,0.67],[746,1],[1000,1.34],[1500,2.01],[5000,6.71],[10000,13.41]] },
    // PRESSURE
    { slug: 'psi-to-bar', title: 'PSI to Bar Converter', desc: 'Convert PSI to bar. Pressure conversion for tires, engineering, and science.',
      from: 'PSI', to: 'Bar', formula: 'return v*0.0689476', reverse: 'return v/0.0689476',
      table: [[14.7,1.01],[20,1.38],[30,2.07],[32,2.21],[35,2.41],[40,2.76],[50,3.45],[60,4.14],[100,6.89]] },
    // FUEL
    { slug: 'mpg-to-l100km', title: 'MPG to L/100km Converter', desc: 'Convert miles per gallon to liters per 100 kilometers. Fuel economy conversion.',
      from: 'Miles/gallon (MPG)', to: 'Liters/100km', formula: 'return 235.215/v', reverse: 'return 235.215/v',
      table: [[15,15.68],[20,11.76],[25,9.41],[30,7.84],[35,6.72],[40,5.88],[45,5.23],[50,4.7]] },
];

console.log(`Generating ${conversions.length} converter pages...`);
const sitemapEntries = [];

conversions.forEach(c => {
    const html = convPage(c.slug, c.title, c.desc, c.from, c.to, null, c.formula, c.reverse, c.table);
    fs.writeFileSync(`${__dirname}/convert/${c.slug}.html`, html);
    sitemapEntries.push(`    <url><loc>${BASE}/convert/${c.slug}.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
    console.log(`  ✅ ${c.slug}`);
});

// Update sitemap
const sitemap = fs.readFileSync(`${__dirname}/sitemap.xml`, 'utf8');
fs.writeFileSync(`${__dirname}/sitemap.xml`, sitemap.replace('</urlset>', sitemapEntries.join('\n') + '\n</urlset>'));

console.log(`\n🎉 Generated ${conversions.length} converter pages`);
console.log(`Total new pages in /convert/: ${conversions.length}`);
