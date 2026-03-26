const fs = require('fs');
const path = require('path');

const pagePath = process.argv[2];
if (!pagePath) {
  console.error('Usage: node check-page.js <path-to-html>');
  process.exit(1);
}

const html = fs.readFileSync(pagePath, 'utf8');
const fileName = path.basename(pagePath);

const issues = [];
const warnings = [];

// 1. Check for calculator JS (basic presence check)
const hasScript = /<script[^>]*>[\s\S]*?<\/script>/i.test(html);
const hasCalculateFunc = /function\s+calculate|const\s+calculate|onclick="calculate/i.test(html);
if (!hasScript) issues.push('❌ No <script> tag found');
else if (!hasCalculateFunc) warnings.push('⚠️ No calculate function detected');

// 2. Check result display elements
const hasResultDiv = /id=["']result|class=["'][^"']*result/i.test(html);
if (!hasResultDiv) warnings.push('⚠️ No result div detected');

// 3. Check for broken CSS classes (common patterns)
const classPattern = /class=["']([^"']+)["']/g;
const classes = new Set();
let match;
while ((match = classPattern.exec(html)) !== null) {
  match[1].split(/\s+/).forEach(c => classes.add(c));
}

// Check if styles are defined (either inline or link)
const hasInlineStyles = /<style[^>]*>[\s\S]*?<\/style>/i.test(html);
const hasLinkedStyles = /<link[^>]*rel=["']stylesheet["']/i.test(html);
if (!hasInlineStyles && !hasLinkedStyles) issues.push('❌ No CSS found (inline or linked)');

// 4. Check footer
const hasFooter = /<footer/i.test(html);
if (!hasFooter) issues.push('❌ No <footer> tag found');
else {
  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    const footer = footerMatch[0];
    if (!/about\.html/i.test(footer)) warnings.push('⚠️ Footer missing "About" link');
    if (!/privacy\.html/i.test(footer)) warnings.push('⚠️ Footer missing "Privacy" link');
    if (!/contact\.html/i.test(footer)) warnings.push('⚠️ Footer missing "Contact" link');
  }
}

// 5. Check navigation
const hasNav = /<nav/i.test(html);
if (!hasNav) issues.push('❌ No <nav> tag found');

// 6. Check for duplicate H1 tags
const h1Matches = html.match(/<h1[^>]*>/gi);
if (h1Matches && h1Matches.length > 1) issues.push(`❌ ${h1Matches.length} H1 tags found (should be 1)`);
else if (!h1Matches) warnings.push('⚠️ No H1 tag found');

// 7. Check ad slots (max 3)
const adMatches = html.match(/adsbygoogle|ad-slot/gi);
const adCount = adMatches ? adMatches.length / 2 : 0; // Each ad typically has 2 mentions
if (adCount > 3) warnings.push(`⚠️ ${Math.floor(adCount)} ad slots found (recommended max: 3)`);

// 8. Extract internal links
const linkPattern = /href=["']([^"']+)["']/g;
const links = [];
while ((match = linkPattern.exec(html)) !== null) {
  const href = match[1];
  // Filter internal links (not external, not anchors)
  if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
    links.push(href);
  }
}

// Output results as JSON
console.log(JSON.stringify({
  file: fileName,
  issues,
  warnings,
  links: [...new Set(links)],
  stats: {
    hasScript,
    hasCalculateFunc,
    hasResultDiv,
    hasFooter,
    hasNav,
    h1Count: h1Matches ? h1Matches.length : 0,
    adCount: Math.floor(adCount),
    linkCount: links.length
  }
}, null, 2));
