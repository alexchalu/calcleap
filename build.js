#!/usr/bin/env node
/**
 * ToolPulse Build Script
 * Generates individual SEO-optimized HTML pages for each tool
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://alexchalu.github.io/toolpulse';
const AD_CLIENT = 'ca-pub-3112605892426625';

const tools = [
    { id: 'json-formatter', icon: '{ }', name: 'JSON Formatter & Validator', shortName: 'JSON Formatter', desc: 'Format, validate, and minify JSON data instantly. Free online JSON beautifier with syntax highlighting.', badge: 'Developer', keywords: 'json formatter, json validator, json beautifier, json minifier, format json online, pretty print json' },
    { id: 'word-counter', icon: '📝', name: 'Word & Character Counter', shortName: 'Word Counter', desc: 'Count words, characters, sentences, and paragraphs instantly. Free online word counter with reading time estimate.', badge: 'Writing', keywords: 'word counter, character counter, letter counter, word count online, text counter, paragraph counter' },
    { id: 'password-generator', icon: '🔐', name: 'Strong Password Generator', shortName: 'Password Generator', desc: 'Generate strong, secure random passwords. Customize length, include uppercase, lowercase, numbers, and symbols.', badge: 'Security', keywords: 'password generator, random password, strong password, secure password generator, password creator online' },
    { id: 'qr-code-generator', icon: '📱', name: 'Free QR Code Generator', shortName: 'QR Code Generator', desc: 'Create QR codes for URLs, text, WiFi credentials, and more. Download as PNG. No signup required.', badge: 'Utility', keywords: 'qr code generator, create qr code, qr code maker, free qr code, qr code online' },
    { id: 'base64-encoder-decoder', icon: '🔄', name: 'Base64 Encoder & Decoder', shortName: 'Base64 Codec', desc: 'Encode text to Base64 or decode Base64 strings instantly. Free online Base64 conversion tool.', badge: 'Developer', keywords: 'base64 encode, base64 decode, base64 converter, base64 online, encode base64' },
    { id: 'color-converter', icon: '🎨', name: 'Color Converter — HEX RGB HSL', shortName: 'Color Converter', desc: 'Convert colors between HEX, RGB, and HSL formats. Free online color picker and converter tool.', badge: 'Design', keywords: 'color converter, hex to rgb, rgb to hex, hsl converter, color picker online, hex color' },
    { id: 'hash-generator', icon: '🔒', name: 'SHA256 Hash Generator', shortName: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text. Free online hash calculator.', badge: 'Security', keywords: 'hash generator, sha256 hash, md5 hash, sha1 hash, sha512 hash, hash calculator online' },
    { id: 'uuid-generator', icon: '🆔', name: 'UUID Generator (v4)', shortName: 'UUID Generator', desc: 'Generate random UUID v4 identifiers in bulk. Free online GUID generator.', badge: 'Developer', keywords: 'uuid generator, guid generator, random uuid, uuid v4, generate uuid online' },
    { id: 'url-encoder-decoder', icon: '🔗', name: 'URL Encoder & Decoder', shortName: 'URL Codec', desc: 'Encode and decode URL components and query strings. Free online URL encoding tool.', badge: 'Developer', keywords: 'url encoder, url decoder, url encode online, percent encoding, urlencode, urldecode' },
    { id: 'text-case-converter', icon: '🔤', name: 'Text Case Converter', shortName: 'Text Case', desc: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.', badge: 'Writing', keywords: 'text case converter, uppercase converter, lowercase converter, title case, camelcase converter' },
    { id: 'lorem-ipsum-generator', icon: '📄', name: 'Lorem Ipsum Generator', shortName: 'Lorem Ipsum', desc: 'Generate Lorem Ipsum placeholder text for designs and layouts. Customizable paragraphs.', badge: 'Design', keywords: 'lorem ipsum generator, placeholder text, dummy text, lipsum generator, filler text' },
    { id: 'unix-timestamp-converter', icon: '🕐', name: 'Unix Timestamp Converter', shortName: 'Timestamp', desc: 'Convert Unix timestamps to human-readable dates and vice versa. Free epoch converter.', badge: 'Developer', keywords: 'unix timestamp converter, epoch converter, timestamp to date, date to timestamp, unix time' },
    { id: 'percentage-calculator', icon: '📊', name: 'Percentage Calculator', shortName: '% Calculator', desc: 'Calculate percentages, percentage increases, and percentage differences easily.', badge: 'Math', keywords: 'percentage calculator, percent calculator, calculate percentage, percentage increase, percent change' },
    { id: 'unit-converter', icon: '📐', name: 'Unit Converter', shortName: 'Unit Converter', desc: 'Convert between units of length, weight, temperature, data size, and speed.', badge: 'Utility', keywords: 'unit converter, length converter, weight converter, temperature converter, metric converter, convert units' },
    { id: 'regex-tester', icon: '⚙️', name: 'Regex Tester & Debugger', shortName: 'Regex Tester', desc: 'Test and debug regular expressions with real-time matching and highlighting. Free regex tool.', badge: 'Developer', keywords: 'regex tester, regex debugger, regular expression tester, test regex online, regex checker' },
    // NEW TOOLS
    { id: 'markdown-preview', icon: '📋', name: 'Markdown Preview & Editor', shortName: 'Markdown Preview', desc: 'Write Markdown and see live HTML preview side by side. Free online Markdown editor.', badge: 'Writing', keywords: 'markdown preview, markdown editor, markdown to html, markdown viewer, md editor online' },
    { id: 'image-to-base64', icon: '🖼️', name: 'Image to Base64 Converter', shortName: 'Image to Base64', desc: 'Convert images to Base64 encoded strings for embedding in HTML/CSS. Supports PNG, JPG, GIF.', badge: 'Developer', keywords: 'image to base64, convert image base64, base64 image encoder, image to data uri' },
    { id: 'diff-checker', icon: '📑', name: 'Text Diff Checker', shortName: 'Diff Checker', desc: 'Compare two texts and find differences instantly. Free online text comparison tool.', badge: 'Developer', keywords: 'diff checker, text compare, compare text online, find differences, text diff tool' },
    { id: 'css-minifier', icon: '🎯', name: 'CSS Minifier & Beautifier', shortName: 'CSS Minifier', desc: 'Minify or beautify CSS code. Reduce file size for faster loading. Free online CSS tool.', badge: 'Developer', keywords: 'css minifier, css beautifier, minify css, compress css, css formatter online' },
    { id: 'javascript-minifier', icon: '⚡', name: 'JavaScript Minifier', shortName: 'JS Minifier', desc: 'Minify JavaScript code to reduce file size. Free online JS compressor and beautifier.', badge: 'Developer', keywords: 'javascript minifier, js minifier, minify javascript, compress js, js beautifier' },
    { id: 'html-encoder', icon: '🌐', name: 'HTML Entity Encoder/Decoder', shortName: 'HTML Encoder', desc: 'Encode and decode HTML entities. Convert special characters for safe HTML display.', badge: 'Developer', keywords: 'html encoder, html decoder, html entities, encode html, html entity converter, html escape' },
    { id: 'mortgage-calculator', icon: '🏠', name: 'Mortgage Calculator', shortName: 'Mortgage Calc', desc: 'Calculate monthly mortgage payments, total interest, and amortization. Free home loan calculator.', badge: 'Finance', keywords: 'mortgage calculator, home loan calculator, mortgage payment calculator, house payment, amortization calculator' },
    { id: 'bmi-calculator', icon: '⚖️', name: 'BMI Calculator', shortName: 'BMI Calculator', desc: 'Calculate your Body Mass Index (BMI) with height and weight. Metric and imperial units.', badge: 'Health', keywords: 'bmi calculator, body mass index, calculate bmi, bmi checker, weight calculator' },
    { id: 'number-base-converter', icon: '🔢', name: 'Number Base Converter', shortName: 'Base Converter', desc: 'Convert numbers between binary, octal, decimal, and hexadecimal. Free base conversion tool.', badge: 'Developer', keywords: 'binary converter, hex converter, octal converter, decimal to binary, binary to hex, number base converter' },
    { id: 'json-to-csv', icon: '📊', name: 'JSON to CSV Converter', shortName: 'JSON to CSV', desc: 'Convert JSON data to CSV format and download. Free online JSON to CSV tool.', badge: 'Data', keywords: 'json to csv, convert json csv, json csv converter, export json to csv, json to spreadsheet' },
];

function generateToolPage(tool, allTools) {
    const otherTools = allTools.filter(t => t.id !== tool.id).slice(0, 6);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tool.name} — Free Online Tool | ToolPulse</title>
    <meta name="description" content="${tool.desc}">
    <meta name="keywords" content="${tool.keywords}">
    <link rel="canonical" href="${SITE_URL}/${tool.id}.html">
    
    <meta property="og:title" content="${tool.name} — ToolPulse">
    <meta property="og:description" content="${tool.desc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/${tool.id}.html">
    
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
    
    ${tool.id === 'qr-code-generator' ? '<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>' : ''}
    
    <link rel="stylesheet" href="style.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "${tool.name}",
        "description": "${tool.desc}",
        "url": "${SITE_URL}/${tool.id}.html",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "isPartOf": {
            "@type": "WebSite",
            "name": "ToolPulse",
            "url": "${SITE_URL}"
        }
    }
    </script>
</head>
<body>
    <header>
        <div class="header-inner">
            <a href="index.html" class="logo">⚡ ToolPulse</a>
            <p class="tagline">Free tools. No signup. 100% private.</p>
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">🌙</button>
        </div>
    </header>

    <!-- Ad: Top -->
    <div class="ad-slot ad-banner">
        <ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;">
        <nav style="margin-bottom:1rem"><a href="index.html" style="color:var(--accent);text-decoration:none;font-weight:600">← All Tools</a></nav>
        <h1>${tool.icon} ${tool.name}</h1>
        <p style="color:var(--text-muted);margin-bottom:2rem">${tool.desc}</p>
        
        <div class="tool-content" id="toolContent"></div>

        <!-- Ad: Mid Content -->
        <div class="ad-slot" style="margin:2rem 0">
            <ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <!-- Related Tools -->
        <section style="margin-top:3rem">
            <h2 style="font-size:1.3rem;margin-bottom:1rem">More Free Tools</h2>
            <div class="tool-grid">
                ${otherTools.map(t => `
                <a class="tool-card" href="${t.id}.html">
                    <div class="icon">${t.icon}</div>
                    <h3>${t.shortName}</h3>
                    <p>${t.desc.split('.')[0]}.</p>
                    <span class="badge">${t.badge}</span>
                </a>`).join('')}
            </div>
        </section>
    </main>

    <!-- Ad: Bottom -->
    <div class="ad-slot ad-banner">
        <ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <footer>
        <p>ToolPulse — All processing happens in your browser. Nothing is uploaded or stored.</p>
        <p class="footer-links"><a href="https://github.com/alexchalu/toolpulse" target="_blank">GitHub</a> · <a href="https://alexchalu.github.io/smartcalc/">Financial Calculators</a> · Built with ❤️</p>
    </footer>

    <script src="app.js"></script>
    <script>
        // Theme setup
        (function() {
            const btn = document.getElementById('themeToggle');
            const saved = localStorage.getItem('tp-theme');
            if (saved === 'light') { document.documentElement.setAttribute('data-theme', 'light'); btn.textContent = '☀️'; }
            btn.addEventListener('click', () => {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
                btn.textContent = isLight ? '🌙' : '☀️';
                localStorage.setItem('tp-theme', isLight ? 'dark' : 'light');
            });
        })();
        // Render tool
        document.addEventListener('DOMContentLoaded', function() {
            const toolId = '${tool.id}';
            const container = document.getElementById('toolContent');
            if (!container) return;
            
            // Map page IDs to app.js tool IDs
            const idMap = {
                'password-generator': 'password-gen',
                'qr-code-generator': 'qr-generator',
                'base64-encoder-decoder': 'base64',
                'hash-generator': 'hash-gen',
                'uuid-generator': 'uuid-gen',
                'url-encoder-decoder': 'url-codec',
                'text-case-converter': 'text-case',
                'lorem-ipsum-generator': 'lorem-ipsum',
                'unix-timestamp-converter': 'timestamp',
                'percentage-calculator': 'percentage-calc',
            };
            const lookupId = idMap[toolId] || toolId;
            
            // Try _toolRenderers from app.js first
            if (window._toolRenderers && window._toolRenderers[lookupId]) {
                window._toolRenderers[lookupId](container);
            }
            // Then try window.render_xxx for new tools
            else {
                const fn = window['render_' + toolId.replace(/-/g, '_')];
                if (fn) fn(container);
            }
        });
    </script>
</body>
</html>`;
}

function generateIndex(allTools) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToolPulse — 25 Free Online Tools | No Signup Required</title>
    <meta name="description" content="25+ free online tools — JSON formatter, password generator, QR code maker, word counter, mortgage calculator, and more. No signup. 100% private — runs in your browser.">
    <meta name="keywords" content="free online tools, developer tools, password generator, json formatter, qr code generator, word counter, base64 encoder, unit converter, mortgage calculator">
    <link rel="canonical" href="${SITE_URL}/">
    
    <meta property="og:title" content="ToolPulse — 25 Free Online Tools">
    <meta property="og:description" content="Fast, free, privacy-friendly online tools. No signup required.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/">
    
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
    
    <link rel="stylesheet" href="style.css">
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ToolPulse",
        "description": "25+ free online tools. No signup. 100% private.",
        "url": "${SITE_URL}",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "${SITE_URL}/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>
</head>
<body>
    <header>
        <div class="header-inner">
            <a href="index.html" class="logo">⚡ ToolPulse</a>
            <p class="tagline">Free tools. No signup. 100% private.</p>
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">🌙</button>
        </div>
    </header>

    <div class="ad-slot ad-banner">
        <ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <main style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem;min-height:calc(100vh - 200px);">
        <div style="text-align:center;margin-bottom:2.5rem">
            <h1 style="font-size:2rem;margin-bottom:0.5rem">Free Online Tools</h1>
            <p style="color:var(--text-muted);max-width:600px;margin:0 auto">25+ tools that run 100% in your browser. No data leaves your device. No signup, no tracking, no BS.</p>
        </div>
        
        <div class="search-bar" style="text-align:center;margin-bottom:2rem">
            <input type="text" id="toolSearch" placeholder="Search tools..." aria-label="Search tools" style="max-width:500px">
        </div>

        <div class="tool-grid" id="toolGrid">
            ${allTools.map(t => `
            <a class="tool-card" href="${t.id}.html" data-name="${t.name.toLowerCase()} ${t.badge.toLowerCase()}">
                <div class="icon">${t.icon}</div>
                <h3>${t.shortName}</h3>
                <p>${t.desc.split('.')[0]}.</p>
                <span class="badge">${t.badge}</span>
            </a>`).join('')}
        </div>
    </main>

    <div class="ad-slot ad-banner">
        <ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <footer>
        <p>ToolPulse — All processing happens in your browser. Nothing is uploaded or stored.</p>
        <p class="footer-links"><a href="https://github.com/alexchalu/toolpulse" target="_blank">GitHub</a> · <a href="https://alexchalu.github.io/smartcalc/">Financial Calculators</a> · Built with ❤️</p>
    </footer>

    <script>
        // Theme
        (function() {
            const btn = document.getElementById('themeToggle');
            const saved = localStorage.getItem('tp-theme');
            if (saved === 'light') { document.documentElement.setAttribute('data-theme', 'light'); btn.textContent = '☀️'; }
            btn.addEventListener('click', () => {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
                btn.textContent = isLight ? '🌙' : '☀️';
                localStorage.setItem('tp-theme', isLight ? 'dark' : 'light');
            });
        })();
        // Search
        document.getElementById('toolSearch').addEventListener('input', function() {
            const q = this.value.toLowerCase();
            document.querySelectorAll('.tool-card').forEach(c => {
                c.style.display = c.dataset.name.includes(q) ? '' : 'none';
            });
        });
    </script>
</body>
</html>`;
}

function generateSitemap(allTools) {
    const urls = [
        { loc: `${SITE_URL}/`, priority: '1.0' },
        ...allTools.map(t => ({ loc: `${SITE_URL}/${t.id}.html`, priority: '0.9' }))
    ];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
}

// Build
console.log('Building ToolPulse...');

// Generate index
fs.writeFileSync(path.join(__dirname, 'index.html'), generateIndex(tools));
console.log('✅ index.html');

// Generate individual tool pages
tools.forEach(tool => {
    fs.writeFileSync(path.join(__dirname, `${tool.id}.html`), generateToolPage(tool, tools));
    console.log(`✅ ${tool.id}.html`);
});

// Generate sitemap
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), generateSitemap(tools));
console.log('✅ sitemap.xml');

// Update robots.txt
fs.writeFileSync(path.join(__dirname, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('✅ robots.txt');

console.log(`\n🎉 Built ${tools.length} tool pages + index + sitemap`);
