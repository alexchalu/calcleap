#!/usr/bin/env node
/**
 * Migrate ALL CalcLeap tool pages to Apple-inspired design system.
 * Preserves each page's unique calculator HTML + JavaScript.
 * Replaces: header, footer, CSS, navigation, breadcrumbs.
 */
const fs = require('fs');
const path = require('path');

const AD = 'ca-pub-3112605892426625';

// Apple design CSS — matches index.html
const APPLE_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#fafafa;--surface:#fff;--border:rgba(0,0,0,.06);--border-hover:rgba(0,0,0,.12);--text:#1d1d1f;--text-secondary:#6e6e73;--text-tertiary:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-subtle:rgba(0,113,227,.06);--shadow-sm:0 1px 3px rgba(0,0,0,.04),0 1px 2px rgba(0,0,0,.06);--shadow-md:0 4px 16px rgba(0,0,0,.06),0 1px 4px rgba(0,0,0,.04);--radius:16px;--radius-sm:12px;--max-w:1120px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.47059;letter-spacing:-.022em}
a{color:inherit;text-decoration:none}

/* Nav */
.cl-nav{position:sticky;top:0;z-index:100;background:rgba(251,251,253,.72);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.cl-nav-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px}
.cl-logo{font-size:1.15rem;font-weight:700;letter-spacing:-.02em;color:var(--text)}
.cl-logo span{color:var(--accent)}
.cl-nav-links{display:flex;align-items:center;gap:.25rem}
.cl-nav-links a{font-size:.8125rem;font-weight:400;color:var(--text-secondary);padding:.5rem .75rem;border-radius:8px;transition:all .2s ease}
.cl-nav-links a:hover{color:var(--text);background:rgba(0,0,0,.03)}
.cl-nav-links a.active{color:var(--text);background:rgba(0,0,0,.04)}

/* Breadcrumb */
.cl-breadcrumb{max-width:var(--max-w);margin:0 auto;padding:1rem 2rem .5rem;font-size:.8125rem;color:var(--text-tertiary)}
.cl-breadcrumb a{color:var(--text-secondary);transition:color .15s}
.cl-breadcrumb a:hover{color:var(--accent)}
.cl-breadcrumb span{margin:0 .4rem;opacity:.5}

/* Page hero */
.cl-hero{max-width:var(--max-w);margin:0 auto;padding:.5rem 2rem 1.5rem;text-align:left}
.cl-hero h1{font-size:2rem;font-weight:700;letter-spacing:-.03em;line-height:1.15;margin-bottom:.5rem}
.cl-hero p{font-size:1rem;color:var(--text-secondary);max-width:640px;line-height:1.5}

/* Calculator card */
.cl-calc-card{max-width:var(--max-w);margin:0 auto;padding:0 2rem}
.cl-calc-inner{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;box-shadow:var(--shadow-sm)}

/* Inputs */
.calc-card,.calc-box{background:var(--white) !important;border:1px solid var(--border) !important;border-radius:var(--radius) !important;color:var(--text) !important}
input[type="number"],input[type="text"],select,textarea{background:var(--bg) !important;border:1px solid var(--border) !important;border-radius:8px !important;color:var(--text) !important;font-family:var(--font) !important;padding:.65rem .85rem !important;font-size:.9375rem !important;outline:none !important;transition:border-color .2s !important}
input:focus,select:focus,textarea:focus{border-color:var(--accent) !important;box-shadow:0 0 0 3px rgba(0,113,227,.1) !important}
label{font-size:.8125rem !important;font-weight:600 !important;color:var(--text) !important;margin-bottom:.35rem !important;display:block !important;letter-spacing:.01em !important}

/* Buttons */
.calc-btn,button[onclick*="calculate"],button[onclick*="calc"],button[onclick*="convert"],button[onclick*="generate"],button[onclick*="format"]{background:var(--accent) !important;color:#fff !important;border:none !important;padding:.75rem 2rem !important;border-radius:var(--radius-sm) !important;font-size:.9375rem !important;font-weight:600 !important;cursor:pointer !important;font-family:var(--font) !important;transition:all .2s !important;letter-spacing:-.01em !important}
.calc-btn:hover,button[onclick*="calculate"]:hover,button[onclick*="calc"]:hover{background:var(--accent-hover) !important}

/* Toggle buttons */
.toggle-btn{background:var(--bg) !important;color:var(--text-secondary) !important;border:1px solid var(--border) !important;border-radius:8px !important;padding:.5rem 1rem !important;font-size:.8125rem !important;font-weight:500 !important;cursor:pointer !important;font-family:var(--font) !important;transition:all .2s !important}
.toggle-btn.active{background:var(--accent) !important;color:#fff !important;border-color:var(--accent) !important}

/* Result */
.result-box,.result,.result-card{background:var(--accent-subtle) !important;border:1px solid rgba(0,113,227,.15) !important;border-radius:var(--radius-sm) !important;color:var(--text) !important;padding:1.25rem !important;margin-top:1rem !important}
.result-box h3,.result h3{color:var(--text) !important;font-weight:700 !important}

/* Sections */
.section,.info-section,.faq-section{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem;margin-top:1.5rem}
.section h3,.info-section h3{font-size:1.125rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1rem;color:var(--text)}

/* FAQ */
.faq-item{padding:1rem 0;border-bottom:1px solid var(--border)}
.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:600;font-size:.9375rem;margin-bottom:.5rem;color:var(--text)}
.faq-a{font-size:.875rem;color:var(--text-secondary);line-height:1.6}

/* Table */
table,.bmi-table{width:100%;border-collapse:collapse;font-size:.875rem}
table th{background:var(--bg);font-weight:600;text-align:left;padding:.75rem 1rem;border-bottom:2px solid var(--border);font-size:.8125rem;text-transform:uppercase;letter-spacing:.04em;color:var(--text-tertiary)}
table td{padding:.65rem 1rem;border-bottom:1px solid var(--border);color:var(--text-secondary)}

/* Related tools */
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem}
.related-link,.related-card{display:block;padding:.75rem 1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.8125rem;color:var(--text-secondary);transition:all .2s;text-decoration:none}
.related-link:hover,.related-card:hover{border-color:var(--border-hover);color:var(--accent)}

/* Ad slots */
.cl-ad{max-width:var(--max-w);margin:1.5rem auto;padding:0 2rem}

/* Container/main overrides */
.container,main{max-width:var(--max-w) !important;margin:0 auto !important;padding:0 2rem 3rem !important;background:transparent !important}

/* Color dots */
.color-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:.5rem;vertical-align:middle}

/* Grid */
.input-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem}
.input-row{display:flex;gap:.75rem}
.input-group{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.5rem}

/* Footer */
.cl-footer{border-top:1px solid var(--border);padding:3rem 2rem 2rem;margin-top:3rem;background:var(--white)}
.cl-footer-inner{max-width:var(--max-w);margin:0 auto}
.cl-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2.5rem;margin-bottom:2.5rem}
.cl-footer h5{font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);margin-bottom:.85rem}
.cl-footer p{font-size:.8125rem;color:var(--text-secondary);line-height:1.6}
.cl-footer a{display:block;font-size:.8125rem;color:var(--text-secondary);padding:.25rem 0;transition:color .15s}
.cl-footer a:hover{color:var(--text)}
.cl-footer-bottom{padding-top:1.5rem;border-top:1px solid var(--border);text-align:center}
.cl-footer-bottom p{font-size:.75rem;color:var(--text-tertiary)}

/* Responsive */
@media(max-width:768px){
  .cl-nav-links{display:none}
  .cl-hero h1{font-size:1.5rem}
  .cl-hero,.cl-breadcrumb,.cl-calc-card,.cl-ad,.container,main{padding-left:1.25rem !important;padding-right:1.25rem !important}
  .cl-footer-grid{grid-template-columns:1fr;gap:1.5rem}
  .input-grid{grid-template-columns:1fr}
  .related-grid{grid-template-columns:1fr 1fr}
}
`.trim();

// Category detection
function detectCategory(filename, title) {
  const f = filename.toLowerCase();
  const t = (title || '').toLowerCase();
  if (f.includes('insurance') || t.includes('insurance')) return { name: 'Insurance', id: 'insurance' };
  if (f.includes('tax') || t.includes('tax')) return { name: 'Tax', id: 'tax' };
  if (f.includes('mortgage') || f.includes('loan') || f.includes('401k') || f.includes('roth') || f.includes('retirement') || f.includes('paycheck') || f.includes('compound') || f.includes('roi') || f.includes('debt') || f.includes('investment') || f.includes('savings') || f.includes('heloc') || f.includes('annuity') || f.includes('pension') || t.includes('finance') || t.includes('financial')) return { name: 'Finance', id: 'finance' };
  if (f.includes('bmi') || f.includes('calorie') || f.includes('body-fat') || f.includes('pregnancy') || f.includes('sleep') || f.includes('bac') || f.includes('pace') || f.includes('health') || f.includes('weight') || t.includes('health') || t.includes('fitness')) return { name: 'Health', id: 'health' };
  if (f.includes('convert-') || f.includes('converter')) return { name: 'Converters', id: 'converters' };
  if (f.includes('json') || f.includes('base64') || f.includes('hash') || f.includes('uuid') || f.includes('password') || f.includes('regex') || f.includes('css-') || f.includes('javascript-') || f.includes('html-') || f.includes('diff') || f.includes('qr-code') || f.includes('url-') || f.includes('markdown')) return { name: 'Developer Tools', id: 'dev' };
  if (f.includes('bitcoin') || f.includes('ethereum') || f.includes('crypto') || f.includes('dogecoin')) return { name: 'Cryptocurrency', id: 'crypto' };
  if (f.includes('business') || f.includes('startup') || f.includes('freelance') || f.includes('payroll') || f.includes('inventory') || f.includes('break-even') || f.includes('cash-flow') || f.includes('customer-lifetime')) return { name: 'Business', id: 'business' };
  if (f.includes('age-') || f.includes('days-between') || f.includes('week-number') || f.includes('unix-') || f.includes('timezone') || f.includes('add-days')) return { name: 'Date & Time', id: 'date' };
  if (f.includes('word-counter') || f.includes('text-case') || f.includes('lorem') || f.includes('color-converter') || f.includes('image-to')) return { name: 'Text & Writing', id: 'text' };
  if (f.includes('fraction') || f.includes('square-root') || f.includes('scientific') || f.includes('gpa') || f.includes('number-base') || f.includes('percentage') || f.includes('percent')) return { name: 'Math', id: 'math' };
  if (f.includes('solar') || f.includes('electric') || f.includes('gas-mileage') || f.includes('concrete') || f.includes('screen-size') || f.includes('recipe')) return { name: 'Home & Auto', id: 'home' };
  return { name: 'Tools', id: 'tools' };
}

function buildNav(activeCategory) {
  const cats = [
    { name: 'Finance', id: 'finance' },
    { name: 'Insurance', id: 'insurance' },
    { name: 'Tax', id: 'tax' },
    { name: 'Health', id: 'health' },
    { name: 'Converters', id: 'converters' },
    { name: 'Dev Tools', id: 'dev' },
  ];
  const links = cats.map(c => {
    const cls = c.id === activeCategory ? ' class="active"' : '';
    return `<a href="index.html#${c.id}"${cls}>${c.name}</a>`;
  }).join('\n      ');
  
  return `<nav class="cl-nav">
  <div class="cl-nav-inner">
    <a href="/" class="cl-logo">Calc<span>Leap</span></a>
    <div class="cl-nav-links">
      ${links}
      <a href="about.html">About</a>
    </div>
  </div>
</nav>`;
}

function buildBreadcrumb(category, pageTitle, isSubdir) {
  const prefix = isSubdir ? '../' : '';
  return `<div class="cl-breadcrumb">
  <a href="${prefix}index.html">Home</a><span>›</span><a href="${prefix}index.html#${category.id}">${category.name}</a><span>›</span>${pageTitle}
</div>`;
}

function buildFooter(isSubdir) {
  const prefix = isSubdir ? '../' : '';
  return `<footer class="cl-footer">
  <div class="cl-footer-inner">
    <div class="cl-footer-grid">
      <div>
        <a class="cl-logo" href="${prefix}index.html">Calc<span style="color:var(--accent)">Leap</span></a>
        <p style="margin-top:.5rem">Fast, beautiful, and private calculators for everyone. Built with care, free forever.</p>
      </div>
      <div>
        <h5>Popular</h5>
        <a href="${prefix}bmi-calculator.html">BMI Calculator</a>
        <a href="${prefix}calc/mortgage-payment.html">Mortgage</a>
        <a href="${prefix}income-tax-calculator.html">Income Tax</a>
        <a href="${prefix}calc/compound-interest.html">Compound Interest</a>
      </div>
      <div>
        <h5>Categories</h5>
        <a href="${prefix}index.html#finance">Financial</a>
        <a href="${prefix}index.html#insurance">Insurance</a>
        <a href="${prefix}index.html#health">Health</a>
        <a href="${prefix}index.html#converters">Converters</a>
      </div>
      <div>
        <h5>Company</h5>
        <a href="${prefix}about.html">About</a>
        <a href="${prefix}privacy.html">Privacy</a>
        <a href="${prefix}contact.html">Contact</a>
        <a href="${prefix}blog/index.html">Blog</a>
      </div>
    </div>
    <div class="cl-footer-bottom">
      <p>© 2026 CalcLeap. All calculations are for informational purposes only.</p>
    </div>
  </div>
</footer>`;
}

function migrateFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Skip non-tool pages
  const basename = path.basename(filePath);
  if (['index.html', 'about.html', 'privacy.html', 'contact.html', 'sitemap.xml', 'robots.txt', 'ads.txt', '404.html'].includes(basename)) return false;
  if (basename.startsWith('google') || basename === 'CNAME' || basename === 'BingSiteAuth.xml') return false;
  
  // Already migrated?
  if (html.includes('cl-nav') || html.includes('#fafafa') || html.includes('Apple-inspired')) return false;
  
  // Extract title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s*[—–|]\s*CalcLeap.*$/i, '').replace(/\s*[—–|]\s*Free.*$/i, '').trim() : basename.replace('.html', '');
  
  // Extract meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const desc = descMatch ? descMatch[1] : '';
  
  // Extract canonical
  const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const canonical = canonMatch ? canonMatch[1] : `https://calcleap.com/${path.relative('.', filePath)}`;
  
  // Extract OG tags
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
  
  // Extract schema JSON-LD
  const schemaMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  const schema = schemaMatch ? schemaMatch[0] : '';
  
  // Extract the calculator content (between header/nav and footer)
  // Strategy: grab everything inside <main> or .container, or between </header> and <footer
  let calcContent = '';
  
  // Try to find main content
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    calcContent = mainMatch[1];
  } else {
    // Fallback: get content between </header> and <footer
    const headerEnd = html.indexOf('</header>');
    const footerStart = html.indexOf('<footer');
    if (headerEnd > -1 && footerStart > -1) {
      calcContent = html.substring(headerEnd + '</header>'.length, footerStart);
    } else {
      // Last resort: between </head><body> and last </div><script>
      const bodyStart = html.indexOf('<body>');
      const bodyEnd = html.lastIndexOf('</body>');
      if (bodyStart > -1 && bodyEnd > -1) {
        calcContent = html.substring(bodyStart + '<body>'.length, bodyEnd);
        // Remove any header/footer we find
        calcContent = calcContent.replace(/<header[\s\S]*?<\/header>/gi, '');
        calcContent = calcContent.replace(/<footer[\s\S]*?<\/footer>/gi, '');
      }
    }
  }
  
  // Extract the final <script> block(s) that contain calculator logic
  const scripts = [];
  const scriptRegex = /<script>(?!.*adsbygoogle)([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].trim().length > 20 && !match[1].includes('adsbygoogle') && !match[1].includes('toggleMenu') && !match[1].includes('toggleMobileNav')) {
      scripts.push(match[1]);
    }
  }
  
  // Remove old inline styles from calcContent
  calcContent = calcContent.replace(/<header[\s\S]*?<\/header>/gi, '');
  calcContent = calcContent.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  // Remove old ad blocks - we'll add our own
  // Keep the ad divs but clean them
  
  // Detect category
  const isSubdir = filePath.includes('/calc/') || filePath.includes('/blog/') || filePath.includes('/percent/');
  const category = detectCategory(basename, title);
  const prefix = isSubdir ? '../' : '';
  
  // Extract h1 text from content for hero
  const h1Match = calcContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let heroTitle = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').trim() : title;
  // Remove emoji from h1
  heroTitle = heroTitle.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F000}-\u{1F02F}]/gu, '').trim();
  
  // Extract description from hero p
  const heroPMatch = calcContent.match(/<div class="hero">\s*<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i);
  const heroDesc = heroPMatch ? heroPMatch[1].trim() : desc;
  
  // Remove old hero section from calcContent (we'll rebuild it)
  calcContent = calcContent.replace(/<div class="hero">[\s\S]*?<\/div>\s*/i, '');
  // Remove old breadcrumb
  calcContent = calcContent.replace(/<div class="breadcrumb">[\s\S]*?<\/div>\s*/i, '');
  
  // Build the page
  const fullTitle = titleMatch ? titleMatch[1] : `${title} | CalcLeap`;
  
  const newHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fullTitle}</title>
${desc ? `<meta name="description" content="${desc}">` : ''}
<link rel="canonical" href="${canonical}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
${ogTitle ? `<meta property="og:title" content="${ogTitle[1]}">` : ''}
${ogDesc ? `<meta property="og:description" content="${ogDesc[1]}">` : ''}
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD}" crossorigin="anonymous"></script>
${schema}
<style>
${APPLE_CSS}
</style>
</head>
<body>

${buildNav(category.id)}

${buildBreadcrumb(category, heroTitle, isSubdir)}

<div class="cl-hero">
  <h1>${heroTitle}</h1>
  ${heroDesc ? `<p>${heroDesc}</p>` : ''}
</div>

<div class="cl-ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<div class="cl-calc-card">
<div class="cl-calc-inner">
${calcContent.trim()}
</div>
</div>

<div class="cl-ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

${buildFooter(isSubdir)}

${scripts.map(s => `<script>${s}</script>`).join('\n')}
</body>
</html>`;

  fs.writeFileSync(filePath, newHtml);
  return true;
}

// Find all HTML files
function findHtmlFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      results = results.concat(findHtmlFiles(full));
    } else if (item.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const files = findHtmlFiles('.');
let migrated = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
  try {
    if (migrateFile(file)) {
      migrated++;
    } else {
      skipped++;
    }
  } catch (e) {
    errors++;
    console.error(`ERROR: ${file}: ${e.message}`);
  }
}

console.log(`\nMigration complete:`);
console.log(`  Migrated: ${migrated}`);
console.log(`  Skipped:  ${skipped} (already done or excluded)`);
console.log(`  Errors:   ${errors}`);
console.log(`  Total:    ${files.length}`);
