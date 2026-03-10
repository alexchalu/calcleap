#!/usr/bin/env node
/**
 * Fix ALL broken related links across the site.
 * Builds an index of all actual HTML files, then fixes any href
 * in related-link/related-card sections that points to non-existent files.
 */
const fs = require('fs');
const path = require('path');

// Build index of all HTML files
function findAll(dir, base='') {
  let results = {};
  try {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      const rel = base ? base + '/' + item : item;
      if (fs.statSync(full).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        Object.assign(results, findAll(full, rel));
      } else if (item.endsWith('.html')) {
        results[item] = rel; // filename → relative path
      }
    }
  } catch(e) {}
  return results;
}

const index = findAll('.');
// Also build a fuzzy index: strip common suffixes
const fuzzy = {};
for (const [name, relPath] of Object.entries(index)) {
  const base = name.replace('.html', '');
  fuzzy[base] = relPath;
  // Also index without -calculator suffix
  fuzzy[base.replace('-calculator', '')] = relPath;
  // Without calc- prefix
  if (base.startsWith('calc-')) fuzzy[base.substring(5)] = relPath;
}

function findBestMatch(broken) {
  const base = broken.replace('.html', '');
  
  // Exact match in a subdirectory?
  if (index[broken]) return index[broken];
  
  // Try calc/ prefix
  if (index[broken] === undefined) {
    const inCalc = 'calc/' + broken;
    if (fs.existsSync(inCalc)) return inCalc;
  }
  
  // Fuzzy: try without -calculator
  const stripped = base.replace('-calculator', '');
  for (const [key, val] of Object.entries(index)) {
    const keyBase = key.replace('.html', '');
    if (keyBase === stripped) return val;
    if (keyBase === stripped + '-calculator') return val;
    if (keyBase.includes(stripped) && keyBase.length - stripped.length < 15) return val;
  }
  
  // Try matching the first word
  const firstWord = stripped.split('-')[0];
  const candidates = Object.entries(index).filter(([k]) => k.includes(firstWord));
  if (candidates.length === 1) return candidates[0][1];
  
  return null;
}

// Now fix all HTML files
const allFiles = [];
function collectFiles(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      collectFiles(full);
    } else if (item.endsWith('.html')) {
      allFiles.push(full);
    }
  }
}
collectFiles('.');

let totalFixed = 0;
let totalBroken = 0;
const unfixable = new Set();

for (const file of allFiles) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  const fileDir = path.dirname(file);
  
  // Find all href="something.html" in related sections
  const hrefRegex = /href="([^"]*\.html)"/g;
  let match;
  const replacements = [];
  
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    // Skip absolute URLs and anchors
    if (href.startsWith('http') || href.startsWith('#')) continue;
    
    // Check if file exists relative to current file's directory
    const resolvedPath = path.join(fileDir, href);
    if (fs.existsSync(resolvedPath)) continue;
    
    // Also check from root
    if (fs.existsSync(href)) continue;
    
    // This link is broken — find the correct path
    const broken = path.basename(href);
    const bestMatch = findBestMatch(broken);
    
    if (bestMatch) {
      // Calculate correct relative path from this file
      let correctPath = path.relative(fileDir, bestMatch);
      if (!correctPath.startsWith('.')) correctPath = correctPath; // keep as-is for same dir
      replacements.push({ old: href, new: correctPath });
      totalFixed++;
    } else {
      unfixable.add(broken);
      totalBroken++;
    }
  }
  
  // Apply replacements
  for (const r of replacements) {
    html = html.split(`href="${r.old}"`).join(`href="${r.new}"`);
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, html);
  }
}

console.log(`Links fixed: ${totalFixed}`);
console.log(`Still broken (no match found): ${totalBroken}`);
if (unfixable.size > 0) {
  console.log(`Unfixable files:`);
  [...unfixable].sort().forEach(f => console.log(`  ${f}`));
}
