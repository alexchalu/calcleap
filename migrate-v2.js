#!/usr/bin/env node
/**
 * Migration V2 — SAFE approach.
 * 
 * Strategy: Don't touch the body content structure AT ALL.
 * Only replace:
 *   1. The <style> block → Apple CSS
 *   2. The <header>...</header> → Apple nav
 *   3. The <footer>...</footer> → Apple footer
 *   4. Any inline style="background:#0a0e1a" or similar on <body>
 * 
 * This preserves all calculator HTML structure and JavaScript exactly as-is.
 */
const fs = require('fs');
const path = require('path');

const AD = 'ca-pub-3112605892426625';

const APPLE_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#fafafa;--surface:#fff;--border:rgba(0,0,0,.06);--border-hover:rgba(0,0,0,.12);--text:#1d1d1f;--text-secondary:#6e6e73;--text-tertiary:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-subtle:rgba(0,113,227,.06);--shadow-sm:0 1px 3px rgba(0,0,0,.04),0 1px 2px rgba(0,0,0,.06);--shadow-md:0 4px 16px rgba(0,0,0,.06),0 1px 4px rgba(0,0,0,.04);--radius:16px;--radius-sm:12px;--max-w:1120px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.5;letter-spacing:-.022em}
a{color:inherit;text-decoration:none}

/* Nav */
.cl-nav{position:sticky;top:0;z-index:100;background:rgba(251,251,253,.72);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.cl-nav-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px}
.cl-logo{font-size:1.15rem;font-weight:700;letter-spacing:-.02em;color:var(--text)}
.cl-logo span{color:var(--accent)}
.cl-nav-links{display:flex;align-items:center;gap:.25rem}
.cl-nav-links a{font-size:.8125rem;font-weight:400;color:var(--text-secondary);padding:.5rem .75rem;border-radius:8px;transition:all .2s ease}
.cl-nav-links a:hover{color:var(--text);background:rgba(0,0,0,.03)}

/* Content area */
.container,main,.main-content{max-width:var(--max-w);margin:0 auto;padding:1rem 2rem 3rem;background:transparent}

/* Calculator cards */
.calc-card,.calc-box,.calculator,.tool-container{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;box-shadow:var(--shadow-sm);margin-bottom:1.5rem}

/* Headings */
h1{font-size:2rem;font-weight:700;letter-spacing:-.03em;color:var(--text);margin-bottom:.5rem}
h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em;color:var(--text);margin-bottom:.75rem}
h3{font-size:1.05rem;font-weight:600;color:var(--text);margin-bottom:.5rem}

/* Hero section */
.hero{text-align:left;padding:1rem 0 1.5rem}
.hero h1{font-size:2rem;font-weight:700;letter-spacing:-.03em}
.hero p{font-size:1rem;color:var(--text-secondary);max-width:640px}

/* Breadcrumb */
.breadcrumb{font-size:.8125rem;color:var(--text-tertiary);margin-bottom:.5rem;padding:.5rem 0}
.breadcrumb a{color:var(--text-secondary);transition:color .15s}
.breadcrumb a:hover{color:var(--accent)}
.breadcrumb span{margin:0 .4rem;opacity:.5}

/* Inputs */
input[type="number"],input[type="text"],input[type="email"],input[type="date"],select,textarea{background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--font);padding:.65rem .85rem;font-size:.9375rem;outline:none;transition:border-color .2s;width:100%;margin-bottom:.5rem}
input:focus,select:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1)}
label{font-size:.8125rem;font-weight:600;color:var(--text);margin-bottom:.35rem;display:block;letter-spacing:.01em}

/* Primary buttons */
.calc-btn,button.calculate-btn,.btn-primary,input[type="submit"]{background:var(--accent);color:#fff;border:none;padding:.75rem 2rem;border-radius:var(--radius-sm);font-size:.9375rem;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .2s;letter-spacing:-.01em;margin:.75rem 0}
.calc-btn:hover,button.calculate-btn:hover,.btn-primary:hover{background:var(--accent-hover)}

/* Toggle buttons */
.toggle-btn,.tab-btn{background:var(--bg);color:var(--text-secondary);border:1px solid var(--border);border-radius:8px;padding:.5rem 1rem;font-size:.8125rem;font-weight:500;cursor:pointer;font-family:var(--font);transition:all .2s}
.toggle-btn.active,.tab-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}

/* Result areas */
.result-box,.result,.result-card,.results{background:var(--accent-subtle);border:1px solid rgba(0,113,227,.15);border-radius:var(--radius-sm);color:var(--text);padding:1.25rem;margin-top:1rem}
.result-box h3,.result h3,.result-card h3{color:var(--text);font-weight:700}

/* Sections */
.section,.info-section,.faq-section,.about-section{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem;margin-top:1.5rem}

/* FAQ */
.faq-item{padding:1rem 0;border-bottom:1px solid var(--border)}
.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:600;font-size:.9375rem;margin-bottom:.5rem;color:var(--text)}
.faq-a{font-size:.875rem;color:var(--text-secondary);line-height:1.6}

/* Tables */
table{width:100%;border-collapse:collapse;font-size:.875rem;margin:.75rem 0}
th{background:var(--bg);font-weight:600;text-align:left;padding:.65rem .75rem;border-bottom:2px solid var(--border);font-size:.8125rem;color:var(--text-tertiary)}
td{padding:.6rem .75rem;border-bottom:1px solid var(--border);color:var(--text-secondary)}

/* Related tools */
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem}
.related-link,.related-card{display:block;padding:.75rem 1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.8125rem;color:var(--text-secondary);transition:all .2s;text-decoration:none}
.related-link:hover{border-color:var(--border-hover);color:var(--accent)}

/* Grid helpers */
.input-grid,.form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem}
.input-row{display:flex;gap:.75rem}
.input-group,.form-group{display:flex;flex-direction:column;gap:.25rem;margin-bottom:.75rem}

/* Chart containers */
canvas{max-width:100%;margin:1rem 0}
.chart-container{margin:1.5rem 0;background:var(--white);border-radius:var(--radius-sm);padding:1rem}

/* Color dots */
.color-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:.5rem;vertical-align:middle}

/* Footer override */
.footer,.site-footer{background:var(--white);border-top:1px solid var(--border);padding:2rem;margin-top:2rem;color:var(--text-secondary);font-size:.85rem}
.footer a{color:var(--text-secondary)}
.footer a:hover{color:var(--text)}

/* Apple footer */
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
  h1{font-size:1.5rem}
  .container,main,.main-content{padding:1rem 1.25rem 2rem}
  .cl-footer-grid{grid-template-columns:1fr;gap:1.5rem}
  .input-grid,.form-grid{grid-template-columns:1fr}
  .related-grid{grid-template-columns:1fr 1fr}
}
`.trim();

function buildNav(prefix) {
  return `<nav class="cl-nav">
  <div class="cl-nav-inner">
    <a href="${prefix}index.html" class="cl-logo">Calc<span>Leap</span></a>
    <div class="cl-nav-links">
      <a href="${prefix}index.html#finance">Finance</a>
      <a href="${prefix}index.html#insurance">Insurance</a>
      <a href="${prefix}index.html#tax">Tax</a>
      <a href="${prefix}index.html#health">Health</a>
      <a href="${prefix}index.html#converters">Converters</a>
      <a href="${prefix}index.html#dev">Dev Tools</a>
      <a href="${prefix}about.html">About</a>
    </div>
  </div>
</nav>`;
}

function migrateFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const basename = path.basename(filePath);
  
  // Skip special pages
  if (['index.html', 'about.html', 'privacy.html', 'contact.html', '404.html'].includes(basename)) return false;
  if (!basename.endsWith('.html')) return false;
  if (basename.startsWith('google') || basename === 'BingSiteAuth.xml') return false;
  
  // Check if already has old dark theme or was badly migrated
  const hasDark = html.includes('#0a0e1a') || html.includes('background:#111827') || html.includes('background:var(--bg)');
  const hasBrokenMigration = html.includes('cl-calc-inner');
  
  if (!hasDark && !hasBrokenMigration) return false; // Already clean
  
  const isSubdir = filePath.includes('/calc/') || filePath.includes('/blog/') || filePath.includes('/percent/');
  const prefix = isSubdir ? '../' : '';
  
  // STEP 1: Replace the <style> block
  html = html.replace(/<style>[\s\S]*?<\/style>/i, `<style>\n${APPLE_CSS}\n</style>`);
  
  // STEP 2: Replace the header
  // Match various header patterns
  html = html.replace(/<nav class="cl-nav">[\s\S]*?<\/nav>/i, buildNav(prefix));
  html = html.replace(/<header[^>]*>[\s\S]*?<\/header>/i, buildNav(prefix));
  
  // STEP 3: Remove the broken migration wrapper divs if present
  if (hasBrokenMigration) {
    // Remove the cl-hero wrapper (keep content)
    html = html.replace(/<div class="cl-hero">\s*/g, '');
    // Remove cl-calc-card and cl-calc-inner wrappers
    html = html.replace(/<div class="cl-calc-card">\s*<div class="cl-calc-inner">\s*/g, '');
    // Remove corresponding closing divs — be careful here
    // Instead, just remove all cl-calc-card and cl-calc-inner references
    html = html.replace(/<\/div>\s*<\/div>\s*<div class="cl-ad">/g, '<div class="cl-ad">');
  }
  
  // STEP 4: Replace the old footer with Apple footer  
  // Match the old cl-footer
  html = html.replace(/<footer class="cl-footer">[\s\S]*?<\/footer>/i, '');
  // Match old inline-style footer
  html = html.replace(/<footer[^>]*style[^>]*>[\s\S]*?<\/footer>/i, '');
  // Match div.footer 
  // Don't remove .footer divs as they might be part of the original page content
  
  // STEP 5: Add Apple footer before </body> if not present
  if (!html.includes('cl-footer')) {
    const appleFooter = `<footer class="cl-footer">
  <div class="cl-footer-inner">
    <div class="cl-footer-grid">
      <div>
        <a class="cl-logo" href="${prefix}index.html">Calc<span style="color:var(--accent)">Leap</span></a>
        <p style="margin-top:.5rem">Fast, beautiful, and private calculators. Free forever.</p>
      </div>
      <div>
        <h5>Popular</h5>
        <a href="${prefix}bmi-calculator.html">BMI Calculator</a>
        <a href="${prefix}calc/mortgage-payment.html">Mortgage</a>
        <a href="${prefix}income-tax-calculator.html">Income Tax</a>
      </div>
      <div>
        <h5>Categories</h5>
        <a href="${prefix}index.html#finance">Financial</a>
        <a href="${prefix}index.html#insurance">Insurance</a>
        <a href="${prefix}index.html#health">Health</a>
      </div>
      <div>
        <h5>Company</h5>
        <a href="${prefix}about.html">About</a>
        <a href="${prefix}privacy.html">Privacy</a>
        <a href="${prefix}contact.html">Contact</a>
      </div>
    </div>
    <div class="cl-footer-bottom">
      <p>© 2026 CalcLeap. For informational purposes only.</p>
    </div>
  </div>
</footer>`;
    html = html.replace('</body>', appleFooter + '\n</body>');
  }
  
  // STEP 6: Clean up body tag inline styles
  html = html.replace(/<body[^>]*>/, '<body>');
  
  // STEP 7: Remove old dark color references from inline styles 
  // (header backgrounds, etc. that are in style="" attributes)
  html = html.replace(/style="[^"]*background:\s*#0a0e1a[^"]*"/gi, '');
  html = html.replace(/style="[^"]*background:\s*#111827[^"]*"/gi, '');
  html = html.replace(/style="[^"]*color:\s*#f3f4f6[^"]*"/gi, '');
  
  fs.writeFileSync(filePath, html);
  return true;
}

// Find all HTML files
function findHtmlFiles(dir) {
  let results = [];
  try {
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
  } catch(e) {}
  return results;
}

const files = findHtmlFiles('.');
let migrated = 0, skipped = 0, errors = 0;

for (const file of files) {
  try {
    if (migrateFile(file)) {
      migrated++;
    } else {
      skipped++;
    }
  } catch (e) {
    errors++;
    console.error(`ERROR ${file}: ${e.message}`);
  }
}

console.log(`V2 Migration complete:`);
console.log(`  Fixed: ${migrated}`);
console.log(`  Skipped: ${skipped}`);
console.log(`  Errors: ${errors}`);
