#!/usr/bin/env node
/**
 * Programmatic SEO Page Generator
 * Generates hundreds of specific conversion/calculator pages targeting long-tail keywords
 * e.g., "convert meters to feet", "convert kg to lbs", "100 USD to EUR"
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://toolpulse-free.surge.sh';
const AD_CLIENT = 'ca-pub-3112605892426625';

// High-traffic conversion pairs
const lengthConversions = [
    ['meters', 'feet', 3.28084, 'm', 'ft'],
    ['feet', 'meters', 0.3048, 'ft', 'm'],
    ['miles', 'kilometers', 1.60934, 'mi', 'km'],
    ['kilometers', 'miles', 0.621371, 'km', 'mi'],
    ['inches', 'centimeters', 2.54, 'in', 'cm'],
    ['centimeters', 'inches', 0.393701, 'cm', 'in'],
    ['yards', 'meters', 0.9144, 'yd', 'm'],
    ['meters', 'yards', 1.09361, 'm', 'yd'],
    ['feet', 'inches', 12, 'ft', 'in'],
    ['inches', 'feet', 0.0833333, 'in', 'ft'],
    ['miles', 'feet', 5280, 'mi', 'ft'],
    ['meters', 'centimeters', 100, 'm', 'cm'],
    ['centimeters', 'millimeters', 10, 'cm', 'mm'],
    ['millimeters', 'inches', 0.0393701, 'mm', 'in'],
];

const weightConversions = [
    ['kilograms', 'pounds', 2.20462, 'kg', 'lbs'],
    ['pounds', 'kilograms', 0.453592, 'lbs', 'kg'],
    ['ounces', 'grams', 28.3495, 'oz', 'g'],
    ['grams', 'ounces', 0.035274, 'g', 'oz'],
    ['stones', 'pounds', 14, 'st', 'lbs'],
    ['pounds', 'stones', 0.0714286, 'lbs', 'st'],
    ['kilograms', 'grams', 1000, 'kg', 'g'],
    ['tonnes', 'pounds', 2204.62, 't', 'lbs'],
    ['pounds', 'ounces', 16, 'lbs', 'oz'],
];

const tempConversions = [
    ['celsius', 'fahrenheit', null, '°C', '°F', (v) => v * 9/5 + 32, (v) => (v - 32) * 5/9],
    ['fahrenheit', 'celsius', null, '°F', '°C', (v) => (v - 32) * 5/9, null],
    ['celsius', 'kelvin', null, '°C', 'K', (v) => v + 273.15, null],
    ['kelvin', 'celsius', null, 'K', '°C', (v) => v - 273.15, null],
    ['fahrenheit', 'kelvin', null, '°F', 'K', (v) => (v - 32) * 5/9 + 273.15, null],
];

const dataConversions = [
    ['megabytes', 'gigabytes', 0.000976563, 'MB', 'GB'],
    ['gigabytes', 'megabytes', 1024, 'GB', 'MB'],
    ['gigabytes', 'terabytes', 0.000976563, 'GB', 'TB'],
    ['terabytes', 'gigabytes', 1024, 'TB', 'GB'],
    ['kilobytes', 'megabytes', 0.000976563, 'KB', 'MB'],
    ['megabytes', 'kilobytes', 1024, 'MB', 'KB'],
    ['bits', 'bytes', 0.125, 'b', 'B'],
    ['bytes', 'kilobytes', 0.000976563, 'B', 'KB'],
];

// Example values for each conversion (common searches)
const exampleValues = [1, 5, 10, 25, 50, 100, 200, 500, 1000];

function generateConversionPage(from, to, factor, fromUnit, toUnit, customFn) {
    const slug = `convert-${from}-to-${to}`;
    const title = `Convert ${capitalize(from)} to ${capitalize(to)} — Free Calculator`;
    const desc = `Instantly convert ${from} to ${to}. Free online ${from} to ${to} converter with conversion table. No signup required.`;
    const keywords = `${from} to ${to}, convert ${from} to ${to}, ${fromUnit} to ${toUnit}, ${from} ${to} converter, how many ${to} in a ${from.slice(0, -1) || from}`;

    // Generate conversion table
    let tableRows = exampleValues.map(v => {
        const result = customFn ? customFn(v) : (v * factor);
        return `<tr><td>${v} ${fromUnit}</td><td>${Number(result.toFixed(6))} ${toUnit}</td></tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ToolPulse</title>
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="${SITE_URL}/${slug}.html">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${SITE_URL}/${slug}.html">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="style.css">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "${title}",
        "description": "${desc}",
        "url": "${SITE_URL}/${slug}.html",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }
    </script>
</head>
<body>
    <header><div class="header-inner"><a href="index.html" class="logo">⚡ ToolPulse</a><p class="tagline">Free tools. No signup. 100% private.</p><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">🌙</button></div></header>

    <div class="ad-slot ad-banner"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>

    <main style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">
        <nav style="margin-bottom:1rem"><a href="unit-converter.html" style="color:var(--accent);text-decoration:none;font-weight:600">← Unit Converter</a></nav>
        <h1>Convert ${capitalize(from)} to ${capitalize(to)}</h1>
        <p style="color:var(--text-muted);margin-bottom:2rem">${desc}</p>

        <div class="tool-content">
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:end">
                <div class="field">
                    <label class="label">${capitalize(from)} (${fromUnit})</label>
                    <input type="number" id="convIn" value="1" oninput="doConvert()">
                </div>
                <div style="font-size:2rem;padding-bottom:1rem;text-align:center">→</div>
                <div class="field">
                    <label class="label">${capitalize(to)} (${toUnit})</label>
                    <div class="output-area" id="convOut" style="font-size:1.5rem;font-weight:700;min-height:auto;padding:0.875rem 1rem">${customFn ? customFn(1).toFixed(6) : factor.toFixed(6)}</div>
                </div>
            </div>

            <p style="margin-top:1rem;color:var(--text-muted);font-size:0.9rem">
                <strong>Formula:</strong> ${capitalize(to)} = ${capitalize(from)} × ${factor ? factor : '(formula)'}
            </p>
        </div>

        <div class="ad-slot" style="margin:2rem 0"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>

        <h2 style="margin-top:2rem;font-size:1.3rem">${capitalize(from)} to ${capitalize(to)} Conversion Table</h2>
        <div style="overflow-x:auto;margin-top:1rem">
            <table style="width:100%;border-collapse:collapse;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm)">
                <thead><tr style="background:var(--surface2)">
                    <th style="padding:0.75rem 1rem;text-align:left;border-bottom:1px solid var(--border)">${capitalize(from)}</th>
                    <th style="padding:0.75rem 1rem;text-align:left;border-bottom:1px solid var(--border)">${capitalize(to)}</th>
                </tr></thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>

        <div style="margin-top:2rem;padding:1.5rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)">
            <h2 style="font-size:1.1rem;margin-bottom:0.75rem">How to Convert ${capitalize(from)} to ${capitalize(to)}</h2>
            <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.7">
                To convert ${from} to ${to}, ${factor ? `multiply the value in ${from} by ${factor}` : 'use the formula above'}. 
                For example, 10 ${fromUnit} = ${customFn ? customFn(10).toFixed(4) : (10 * factor).toFixed(4)} ${toUnit}.
                This converter handles the calculation instantly — just enter a value above.
            </p>
        </div>

        <section style="margin-top:3rem">
            <h2 style="font-size:1.2rem;margin-bottom:1rem">More Converters</h2>
            <div class="tool-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
                <a class="tool-card" href="unit-converter.html"><div class="icon">📐</div><h3>All Units</h3><p>Length, weight, temp, data, speed</p></a>
                <a class="tool-card" href="percentage-calculator.html"><div class="icon">📊</div><h3>% Calculator</h3><p>Percentages & changes</p></a>
                <a class="tool-card" href="number-base-converter.html"><div class="icon">🔢</div><h3>Base Converter</h3><p>Binary, hex, octal, decimal</p></a>
            </div>
        </section>
    </main>

    <div class="ad-slot ad-banner"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>

    <footer><p>ToolPulse — All processing happens in your browser.</p></footer>

    <script>
        // Theme
        (function(){const b=document.getElementById('themeToggle');const s=localStorage.getItem('tp-theme');if(s==='light'){document.documentElement.setAttribute('data-theme','light');b.textContent='☀️'}b.addEventListener('click',()=>{const l=document.documentElement.getAttribute('data-theme')==='light';document.documentElement.setAttribute('data-theme',l?'dark':'light');b.textContent=l?'🌙':'☀️';localStorage.setItem('tp-theme',l?'dark':'light')})})();
        
        function doConvert() {
            const v = parseFloat(document.getElementById('convIn').value) || 0;
            ${customFn ? `const result = ${customFn.toString().match(/=> (.*)/)?.[1] || `v * ${factor}`};` : `const result = v * ${factor};`}
            document.getElementById('convOut').textContent = Number(result.toFixed(6));
        }
    </script>
    <style>
        table td { padding: 0.6rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
        table tr:hover { background: var(--surface2); }
    </style>
</body>
</html>`;

    return { slug, html };
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Generate all conversion pages
console.log('Generating programmatic SEO conversion pages...\n');

const allPages = [];
const dir = path.join(__dirname, 'convert');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// Length
lengthConversions.forEach(([from, to, factor, fu, tu]) => {
    const { slug, html } = generateConversionPage(from, to, factor, fu, tu);
    fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
    allPages.push({ slug, from, to });
    console.log(`✅ ${slug}.html`);
});

// Weight
weightConversions.forEach(([from, to, factor, fu, tu]) => {
    const { slug, html } = generateConversionPage(from, to, factor, fu, tu);
    fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
    allPages.push({ slug, from, to });
    console.log(`✅ ${slug}.html`);
});

// Temperature (custom formulas)
const tempFormulas = {
    'celsius-fahrenheit': (v) => v * 9/5 + 32,
    'fahrenheit-celsius': (v) => (v - 32) * 5/9,
    'celsius-kelvin': (v) => v + 273.15,
    'kelvin-celsius': (v) => v - 273.15,
    'fahrenheit-kelvin': (v) => (v - 32) * 5/9 + 273.15,
};

tempConversions.forEach(([from, to, _, fu, tu, fn]) => {
    const { slug, html } = generateConversionPage(from, to, null, fu, tu, fn);
    fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
    allPages.push({ slug, from, to });
    console.log(`✅ ${slug}.html`);
});

// Data
dataConversions.forEach(([from, to, factor, fu, tu]) => {
    const { slug, html } = generateConversionPage(from, to, factor, fu, tu);
    fs.writeFileSync(path.join(__dirname, `${slug}.html`), html);
    allPages.push({ slug, from, to });
    console.log(`✅ ${slug}.html`);
});

// Update sitemap to include conversion pages
const existingSitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
const newUrls = allPages.map(p => 
    `    <url><loc>${SITE_URL}/${p.slug}.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
).join('\n');
const updatedSitemap = existingSitemap.replace('</urlset>', newUrls + '\n</urlset>');
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), updatedSitemap);

console.log(`\n🎉 Generated ${allPages.length} conversion pages`);
console.log(`📊 Total indexable pages: ${25 + allPages.length + 1}`);
