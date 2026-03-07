#!/usr/bin/env node
/**
 * Cooking Conversion SEO Pages
 * "cups to grams", "tablespoons to ml", "ounces to cups" etc.
 * Extremely high search volume — every home cook searches these
 */
const fs = require('fs');
const SITE_URL = 'https://alexchalu.github.io/toolpulse';
const AD = 'ca-pub-3112605892426625';

const conversions = [
    // Cups conversions
    { from: 'cups', to: 'grams', factor: 236.588, fu: 'cups', tu: 'g', cat: 'Volume to Weight' },
    { from: 'cups', to: 'milliliters', factor: 236.588, fu: 'cups', tu: 'ml', cat: 'Volume' },
    { from: 'cups', to: 'ounces', factor: 8, fu: 'cups', tu: 'fl oz', cat: 'Volume' },
    { from: 'cups', to: 'tablespoons', factor: 16, fu: 'cups', tu: 'tbsp', cat: 'Volume' },
    { from: 'cups', to: 'teaspoons', factor: 48, fu: 'cups', tu: 'tsp', cat: 'Volume' },
    { from: 'cups', to: 'liters', factor: 0.236588, fu: 'cups', tu: 'L', cat: 'Volume' },
    { from: 'cups', to: 'pints', factor: 0.5, fu: 'cups', tu: 'pt', cat: 'Volume' },
    { from: 'cups', to: 'quarts', factor: 0.25, fu: 'cups', tu: 'qt', cat: 'Volume' },
    // Tablespoon conversions
    { from: 'tablespoons', to: 'teaspoons', factor: 3, fu: 'tbsp', tu: 'tsp', cat: 'Volume' },
    { from: 'tablespoons', to: 'milliliters', factor: 14.787, fu: 'tbsp', tu: 'ml', cat: 'Volume' },
    { from: 'tablespoons', to: 'cups', factor: 0.0625, fu: 'tbsp', tu: 'cups', cat: 'Volume' },
    { from: 'tablespoons', to: 'grams', factor: 14.787, fu: 'tbsp', tu: 'g', cat: 'Volume to Weight' },
    { from: 'tablespoons', to: 'ounces', factor: 0.5, fu: 'tbsp', tu: 'fl oz', cat: 'Volume' },
    // Teaspoon conversions
    { from: 'teaspoons', to: 'milliliters', factor: 4.929, fu: 'tsp', tu: 'ml', cat: 'Volume' },
    { from: 'teaspoons', to: 'tablespoons', factor: 0.333, fu: 'tsp', tu: 'tbsp', cat: 'Volume' },
    { from: 'teaspoons', to: 'grams', factor: 4.929, fu: 'tsp', tu: 'g', cat: 'Volume to Weight' },
    // Ounce conversions (fluid)
    { from: 'fluid-ounces', to: 'milliliters', factor: 29.574, fu: 'fl oz', tu: 'ml', cat: 'Volume' },
    { from: 'fluid-ounces', to: 'cups', factor: 0.125, fu: 'fl oz', tu: 'cups', cat: 'Volume' },
    { from: 'fluid-ounces', to: 'liters', factor: 0.02957, fu: 'fl oz', tu: 'L', cat: 'Volume' },
    { from: 'fluid-ounces', to: 'tablespoons', factor: 2, fu: 'fl oz', tu: 'tbsp', cat: 'Volume' },
    // Liter conversions
    { from: 'liters', to: 'cups', factor: 4.227, fu: 'L', tu: 'cups', cat: 'Volume' },
    { from: 'liters', to: 'gallons', factor: 0.2642, fu: 'L', tu: 'gal', cat: 'Volume' },
    { from: 'liters', to: 'milliliters', factor: 1000, fu: 'L', tu: 'ml', cat: 'Volume' },
    { from: 'liters', to: 'fluid-ounces', factor: 33.814, fu: 'L', tu: 'fl oz', cat: 'Volume' },
    { from: 'liters', to: 'quarts', factor: 1.057, fu: 'L', tu: 'qt', cat: 'Volume' },
    // Gallon conversions
    { from: 'gallons', to: 'liters', factor: 3.785, fu: 'gal', tu: 'L', cat: 'Volume' },
    { from: 'gallons', to: 'cups', factor: 16, fu: 'gal', tu: 'cups', cat: 'Volume' },
    { from: 'gallons', to: 'quarts', factor: 4, fu: 'gal', tu: 'qt', cat: 'Volume' },
    { from: 'gallons', to: 'pints', factor: 8, fu: 'gal', tu: 'pt', cat: 'Volume' },
    { from: 'gallons', to: 'fluid-ounces', factor: 128, fu: 'gal', tu: 'fl oz', cat: 'Volume' },
    // Milliliter conversions
    { from: 'milliliters', to: 'cups', factor: 0.00423, fu: 'ml', tu: 'cups', cat: 'Volume' },
    { from: 'milliliters', to: 'tablespoons', factor: 0.0676, fu: 'ml', tu: 'tbsp', cat: 'Volume' },
    { from: 'milliliters', to: 'teaspoons', factor: 0.2029, fu: 'ml', tu: 'tsp', cat: 'Volume' },
    { from: 'milliliters', to: 'fluid-ounces', factor: 0.03381, fu: 'ml', tu: 'fl oz', cat: 'Volume' },
    // Pint/Quart
    { from: 'pints', to: 'cups', factor: 2, fu: 'pt', tu: 'cups', cat: 'Volume' },
    { from: 'pints', to: 'liters', factor: 0.4732, fu: 'pt', tu: 'L', cat: 'Volume' },
    { from: 'quarts', to: 'cups', factor: 4, fu: 'qt', tu: 'cups', cat: 'Volume' },
    { from: 'quarts', to: 'liters', factor: 0.9464, fu: 'qt', tu: 'L', cat: 'Volume' },
    // Weight for cooking
    { from: 'ounces', to: 'grams-weight', factor: 28.35, fu: 'oz', tu: 'g', cat: 'Weight' },
    { from: 'grams-weight', to: 'ounces', factor: 0.03527, fu: 'g', tu: 'oz', cat: 'Weight' },
    { from: 'pounds', to: 'grams-cooking', factor: 453.592, fu: 'lbs', tu: 'g', cat: 'Weight' },
    { from: 'pounds', to: 'kilograms-cooking', factor: 0.4536, fu: 'lbs', tu: 'kg', cat: 'Weight' },
];

const amounts = [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 8, 10, 12, 16];

function cap(s) { return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }

function genPage(c) {
    const slug = `convert-${c.from}-to-${c.to}`;
    const fromName = cap(c.from);
    const toName = cap(c.to.replace('-weight','').replace('-cooking',''));
    const title = `${fromName} to ${toName} — Cooking Conversion Calculator`;
    const desc = `Convert ${fromName.toLowerCase()} to ${toName.toLowerCase()} for cooking and baking. 1 ${c.fu} = ${c.factor} ${c.tu}. Free kitchen converter.`;
    const kw = `${c.from} to ${c.to.replace(/-\w+$/,'')}, convert ${c.from} to ${c.to.replace(/-\w+$/,'')}, ${c.fu} to ${c.tu}, cooking conversion, baking conversion, how many ${c.tu} in a ${c.fu}`;

    const rows = amounts.map(a => `<tr><td>${a} ${c.fu}</td><td>${(a * c.factor).toFixed(a * c.factor < 1 ? 4 : 2)} ${c.tu}</td></tr>`).join('');

    return { slug, html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ToolPulse</title>
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${kw}">
    <link rel="canonical" href="${SITE_URL}/${slug}.html">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD}" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="style.css">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${title}","description":"${desc}","url":"${SITE_URL}/${slug}.html","applicationCategory":"UtilityApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
    <style>table{width:100%;border-collapse:collapse;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm)}th{padding:.75rem 1rem;text-align:left;border-bottom:1px solid var(--border);background:var(--surface2)}td{padding:.6rem 1rem;border-bottom:1px solid var(--border);font-size:.9rem}tr:hover{background:var(--surface2)}</style>
</head>
<body>
    <header><div class="header-inner"><a href="index.html" class="logo">⚡ ToolPulse</a><p class="tagline">Free tools. No signup. 100% private.</p><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">🌙</button></div></header>
    <div class="ad-slot ad-banner"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
    <main style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">
        <nav style="margin-bottom:1rem"><a href="unit-converter.html" style="color:var(--accent);text-decoration:none;font-weight:600">← Unit Converter</a></nav>
        <h1>🍳 ${fromName} to ${toName}</h1>
        <p style="color:var(--text-muted);margin-bottom:1.5rem">${desc}</p>
        <div style="font-size:2rem;font-weight:800;color:var(--accent);text-align:center;padding:1.5rem;margin:1rem 0">1 ${c.fu} = ${c.factor} ${c.tu}</div>
        <div class="tool-content">
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:end">
                <div class="field"><label class="label">${fromName} (${c.fu})</label><input type="number" id="fromV" value="1" oninput="calc()"></div>
                <div style="font-size:2rem;padding-bottom:1rem;text-align:center">→</div>
                <div class="field"><label class="label">${toName} (${c.tu})</label><div class="output-area" id="toV" style="font-size:1.5rem;font-weight:700;min-height:auto;padding:.875rem 1rem">${c.factor}</div></div>
            </div>
        </div>
        <div class="ad-slot" style="margin:2rem 0;padding:0"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
        <h2 style="font-size:1.3rem;margin-top:2rem">${fromName} to ${toName} Conversion Table</h2>
        <div style="overflow-x:auto;margin-top:1rem"><table><thead><tr><th>${fromName} (${c.fu})</th><th>${toName} (${c.tu})</th></tr></thead><tbody>${rows}</tbody></table></div>
        <div style="margin-top:2rem;padding:1.5rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)">
            <h2 style="font-size:1.1rem;margin-bottom:.75rem">How to Convert ${fromName} to ${toName}</h2>
            <p style="color:var(--text-muted);font-size:.9rem;line-height:1.7">To convert ${fromName.toLowerCase()} to ${toName.toLowerCase()}, multiply by ${c.factor}. For example, 2 ${c.fu} = ${(2 * c.factor).toFixed(2)} ${c.tu}. This conversion is commonly used in cooking and baking recipes.</p>
        </div>
    </main>
    <div class="ad-slot ad-banner"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
    <footer><p>ToolPulse — All calculations happen in your browser.</p></footer>
    <script>
        (function(){const b=document.getElementById('themeToggle');const s=localStorage.getItem('tp-theme');if(s==='light'){document.documentElement.setAttribute('data-theme','light');b.textContent='☀️'}b.addEventListener('click',()=>{const l=document.documentElement.getAttribute('data-theme')==='light';document.documentElement.setAttribute('data-theme',l?'dark':'light');b.textContent=l?'🌙':'☀️';localStorage.setItem('tp-theme',l?'dark':'light')})})();
        function calc(){const v=parseFloat(document.getElementById('fromV').value)||0;document.getElementById('toV').textContent=(v*${c.factor}).toFixed(v*${c.factor}<1?4:2)+' ${c.tu}'}
    </script>
</body>
</html>` };
}

console.log('Generating cooking conversion pages...');
let count = 0;
const slugs = [];
conversions.forEach(c => {
    const { slug, html } = genPage(c);
    // Only write if not already a file (avoid overwriting unit conversion pages)
    const filepath = `${__dirname}/${slug}.html`;
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, html);
        slugs.push(slug);
        count++;
        console.log(`✅ ${slug}.html`);
    } else {
        console.log(`⏭️  ${slug}.html (exists, skipped)`);
    }
});

// Append to sitemap
if (slugs.length > 0) {
    const sitemap = fs.readFileSync(`${__dirname}/sitemap.xml`, 'utf8');
    const newUrls = slugs.map(s => `    <url><loc>${SITE_URL}/${s}.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n');
    const updated = sitemap.replace('</urlset>', newUrls + '\n</urlset>');
    fs.writeFileSync(`${__dirname}/sitemap.xml`, updated);
}

console.log(`\n🎉 Generated ${count} new cooking conversion pages (${conversions.length - count} skipped as duplicates)`);
