#!/usr/bin/env node
/**
 * Currency Conversion SEO Pages
 * Targets extremely high-volume searches: "USD to EUR", "100 dollars in pounds", etc.
 * Uses approximate rates (updated manually) - the goal is SEO traffic + ads, not forex trading
 */
const fs = require('fs');
const SITE_URL = 'https://alexchalu.github.io/toolpulse';
const AD = 'ca-pub-3112605892426625';

// Major world currencies with approximate rates to USD
const currencies = {
    USD: { name: 'US Dollar', symbol: '$', rate: 1 },
    EUR: { name: 'Euro', symbol: '€', rate: 0.92 },
    GBP: { name: 'British Pound', symbol: '£', rate: 0.79 },
    JPY: { name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
    CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
    AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
    CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.88 },
    CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
    INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.1 },
    MXN: { name: 'Mexican Peso', symbol: 'MX$', rate: 17.15 },
    BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
    KRW: { name: 'South Korean Won', symbol: '₩', rate: 1325 },
    SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
    HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
    NOK: { name: 'Norwegian Krone', symbol: 'kr', rate: 10.5 },
    SEK: { name: 'Swedish Krona', symbol: 'kr', rate: 10.35 },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.64 },
    ZAR: { name: 'South African Rand', symbol: 'R', rate: 18.6 },
    AED: { name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
    PHP: { name: 'Philippine Peso', symbol: '₱', rate: 55.8 },
    THB: { name: 'Thai Baht', symbol: '฿', rate: 35.2 },
    PLN: { name: 'Polish Zloty', symbol: 'zł', rate: 3.98 },
    TRY: { name: 'Turkish Lira', symbol: '₺', rate: 30.2 },
    COP: { name: 'Colombian Peso', symbol: 'COL$', rate: 3950 },
    TWD: { name: 'Taiwan Dollar', symbol: 'NT$', rate: 31.5 },
};

// High-traffic pairs to generate
const pairs = [];
const majorCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'MXN', 'BRL', 'KRW', 'SGD', 'NZD', 'AED', 'PHP'];

for (const from of majorCodes) {
    for (const to of majorCodes) {
        if (from !== to) pairs.push([from, to]);
    }
}

const exampleAmounts = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 10000];

function convert(amount, from, to) {
    const inUSD = amount / currencies[from].rate;
    return inUSD * currencies[to].rate;
}

function generatePage(from, to) {
    const f = currencies[from], t = currencies[to];
    const rate = convert(1, from, to);
    const slug = `convert-${from.toLowerCase()}-to-${to.toLowerCase()}`;
    const title = `${from} to ${to} — Convert ${f.name} to ${t.name}`;
    const desc = `Convert ${f.name} (${from}) to ${t.name} (${to}). 1 ${from} = ${rate.toFixed(4)} ${to}. Free currency converter with live rates.`;
    const keywords = `${from} to ${to}, convert ${from} to ${to}, ${from} ${to} exchange rate, ${f.name.toLowerCase()} to ${t.name.toLowerCase()}, how much is 1 ${from} in ${to}`;
    
    const tableRows = exampleAmounts.map(a => {
        const result = convert(a, from, to);
        return `<tr><td>${f.symbol}${a.toLocaleString()} ${from}</td><td>${t.symbol}${result.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${to}</td></tr>`;
    }).join('');

    // Popular "also convert" links
    const relatedPairs = pairs.filter(p => (p[0] === from || p[1] === to) && !(p[0] === from && p[1] === to)).slice(0, 8);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ToolPulse Currency Converter</title>
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="${SITE_URL}/${slug}.html">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD}" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="style.css">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"WebApplication","name":"${title}","description":"${desc}","url":"${SITE_URL}/${slug}.html","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}
    </script>
    <style>table{width:100%;border-collapse:collapse;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm)}th{padding:.75rem 1rem;text-align:left;border-bottom:1px solid var(--border);background:var(--surface2)}td{padding:.6rem 1rem;border-bottom:1px solid var(--border);font-size:.9rem}tr:hover{background:var(--surface2)}.rate-display{font-size:2.5rem;font-weight:800;color:var(--accent);text-align:center;padding:1.5rem;margin:1rem 0}.swap-btn{background:var(--surface2);border:1px solid var(--border);border-radius:50%;width:40px;height:40px;font-size:1.2rem;cursor:pointer;display:block;margin:0.5rem auto}</style>
</head>
<body>
    <header><div class="header-inner"><a href="index.html" class="logo">⚡ ToolPulse</a><p class="tagline">Free tools. No signup. 100% private.</p><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">🌙</button></div></header>

    <div class="ad-slot ad-banner"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <main style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">
        <nav style="margin-bottom:1rem"><a href="index.html" style="color:var(--accent);text-decoration:none;font-weight:600">← All Tools</a></nav>
        <h1>Convert ${from} to ${to}</h1>
        <p style="color:var(--text-muted);margin-bottom:1.5rem">${f.name} to ${t.name} conversion. Approximate exchange rates.</p>

        <div class="rate-display">1 ${from} = ${rate.toFixed(4)} ${to}</div>

        <div class="tool-content">
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:end">
                <div class="field">
                    <label class="label">${f.name} (${from})</label>
                    <input type="number" id="fromAmt" value="100" oninput="calc()">
                </div>
                <button class="swap-btn" onclick="location.href='convert-${to.toLowerCase()}-to-${from.toLowerCase()}.html'" title="Swap currencies">⇄</button>
                <div class="field">
                    <label class="label">${t.name} (${to})</label>
                    <div class="output-area" id="toAmt" style="font-size:1.5rem;font-weight:700;min-height:auto;padding:.875rem 1rem">${t.symbol}${convert(100, from, to).toFixed(2)}</div>
                </div>
            </div>
        </div>

        <div class="ad-slot" style="margin:2rem 0;padding:0"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

        <h2 style="font-size:1.3rem;margin-top:2rem">${from} to ${to} Conversion Table</h2>
        <div style="overflow-x:auto;margin-top:1rem">
            <table><thead><tr><th>${f.name} (${from})</th><th>${t.name} (${to})</th></tr></thead>
            <tbody>${tableRows}</tbody></table>
        </div>

        <div style="margin-top:2rem;padding:1.5rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)">
            <h2 style="font-size:1.1rem;margin-bottom:.75rem">How to Convert ${from} to ${to}</h2>
            <p style="color:var(--text-muted);font-size:.9rem;line-height:1.7">To convert ${f.name} to ${t.name}, multiply the ${from} amount by ${rate.toFixed(4)}. For example, ${f.symbol}100 ${from} = ${t.symbol}${convert(100, from, to).toFixed(2)} ${to}. Exchange rates fluctuate — this converter uses approximate rates for quick reference.</p>
        </div>

        <h2 style="font-size:1.2rem;margin-top:2rem;margin-bottom:1rem">Popular Currency Conversions</h2>
        <div class="tool-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
            ${relatedPairs.map(([a, b]) => `<a class="tool-card" href="convert-${a.toLowerCase()}-to-${b.toLowerCase()}.html" style="padding:1rem"><h3 style="font-size:.9rem">${a} → ${b}</h3><p style="font-size:.75rem">1 ${a} = ${convert(1, a, b).toFixed(4)} ${b}</p></a>`).join('')}
        </div>
    </main>

    <div class="ad-slot ad-banner"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <footer><p>ToolPulse — Approximate rates for reference only. Not financial advice.</p></footer>

    <script>
        (function(){const b=document.getElementById('themeToggle');const s=localStorage.getItem('tp-theme');if(s==='light'){document.documentElement.setAttribute('data-theme','light');b.textContent='☀️'}b.addEventListener('click',()=>{const l=document.documentElement.getAttribute('data-theme')==='light';document.documentElement.setAttribute('data-theme',l?'dark':'light');b.textContent=l?'🌙':'☀️';localStorage.setItem('tp-theme',l?'dark':'light')})})();
        function calc(){const v=parseFloat(document.getElementById('fromAmt').value)||0;const r=${rate};document.getElementById('toAmt').textContent='${t.symbol}'+( v*r).toFixed(2)}
    </script>
</body>
</html>`;
}

console.log('Generating currency conversion pages...');
let count = 0;
const slugs = [];

for (const [from, to] of pairs) {
    const slug = `convert-${from.toLowerCase()}-to-${to.toLowerCase()}`;
    const html = generatePage(from, to);
    fs.writeFileSync(`${__dirname}/${slug}.html`, html);
    slugs.push(slug);
    count++;
}

// Append to sitemap
const sitemap = fs.readFileSync(`${__dirname}/sitemap.xml`, 'utf8');
const newUrls = slugs.map(s => `    <url><loc>${SITE_URL}/${s}.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n');
const updated = sitemap.replace('</urlset>', newUrls + '\n</urlset>');
fs.writeFileSync(`${__dirname}/sitemap.xml`, updated);

console.log(`\n🎉 Generated ${count} currency conversion pages`);
console.log(`📊 Added to sitemap`);
