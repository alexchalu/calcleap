const fs = require('fs');
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');

// Get all 529 pages
const files = fs.readdirSync('529').filter(f => f.endsWith('.html'));
const today = '2026-03-10';

// Remove closing tag
sitemap = sitemap.replace('</urlset>', '');

// Add 529 pages
files.forEach(f => {
  const url = f === 'index.html' ? 'https://calcleap.com/529/' : `https://calcleap.com/529/${f}`;
  if (!sitemap.includes(url)) {
    sitemap += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
  }
});

sitemap += '</urlset>';
fs.writeFileSync('sitemap.xml', sitemap);

const count = (sitemap.match(/<url>/g) || []).length;
console.log(`Sitemap now has ${count} URLs`);
