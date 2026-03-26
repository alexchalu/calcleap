#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://alexchalu.github.io/calcleap';
const OUTPUT = 'sitemap.xml';

// Recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const htmlFiles = findHtmlFiles('.');
const urls = htmlFiles.map(file => {
  const relativePath = file.replace(/^\.\//, '');
  return `  <url><loc>${BASE_URL}/${relativePath}</loc></url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(OUTPUT, sitemap);
console.log(`✓ Generated sitemap with ${urls.length} URLs`);
console.log(`✓ Saved to ${OUTPUT}`);
