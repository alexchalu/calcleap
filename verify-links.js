const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'mortgage-calculator.html',
  'bmi-calculator.html',
  'reverse-mortgage-calculator.html',
  '1099-tax-calculator.html',
  '401k-withdrawal-calculator.html',
  'mortgage-refinance-calculator.html',
  'about.html',
  'contact.html',
  'privacy.html'
];

const brokenLinks = {};

pages.forEach(page => {
  const html = fs.readFileSync(page, 'utf8');
  const linkPattern = /href=["']([^"']+)["']/g;
  let match;
  const broken = [];
  
  while ((match = linkPattern.exec(html)) !== null) {
    const href = match[1];
    // Skip external, anchors, data URIs, template vars
    if (href.startsWith('http') || href.startsWith('#') || 
        href.startsWith('mailto:') || href.startsWith('tel:') || 
        href.startsWith('data:') || href.includes('${')) continue;
    
    // Normalize path
    let targetPath = href.startsWith('/') ? href.slice(1) : href;
    
    // Check if file exists
    if (!fs.existsSync(targetPath)) {
      broken.push(href);
    }
  }
  
  if (broken.length > 0) {
    brokenLinks[page] = broken;
  }
});

console.log(JSON.stringify(brokenLinks, null, 2));
