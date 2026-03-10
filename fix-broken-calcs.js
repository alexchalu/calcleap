#!/usr/bin/env node
/**
 * Fix broken calculator JS files where calculate() returns an array
 * instead of displaying results. Rewrites the function to show results
 * with styled output and a bar chart.
 */
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.js') && !f.includes('migrate') && !f.includes('fix-broken') && !f.includes('node_modules'));

let fixed = 0;
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  
  // Check if this file has the broken pattern: return [ ... ]; followed by dead code
  if (!code.includes('return [') || !code.includes('result-content')) continue;
  
  // This file has the bug. Rewrite the calculate function.
  // Strategy: Find the return [...] block and capture the items,
  // then rewrite to display them instead of returning.
  
  // Extract the form HTML part (before function calculate)
  const funcIdx = code.indexOf('function calculate()');
  if (funcIdx === -1) continue;
  
  const formPart = code.substring(0, funcIdx);
  const funcPart = code.substring(funcIdx);
  
  // Extract everything between function calculate() { and the return [
  const returnIdx = funcPart.indexOf('return [');
  if (returnIdx === -1) continue;
  
  // Get the calculation logic (between { and return [)
  const openBrace = funcPart.indexOf('{');
  const calcLogic = funcPart.substring(openBrace + 1, returnIdx).trim();
  
  // Extract the return array items
  const returnStart = funcPart.indexOf('return [', returnIdx);
  let bracketCount = 0;
  let returnEnd = -1;
  for (let i = returnStart + 7; i < funcPart.length; i++) {
    if (funcPart[i] === '[') bracketCount++;
    if (funcPart[i] === ']') {
      if (bracketCount === 0) { returnEnd = i + 1; break; }
      bracketCount--;
    }
  }
  
  if (returnEnd === -1) continue;
  
  const returnArray = funcPart.substring(returnStart + 7, returnEnd - 1).trim();
  
  // Parse the array items to extract label and value expressions
  const items = [];
  const itemRegex = /\{\s*label:\s*'([^']+)',\s*value:\s*([^}]+)\}/g;
  let match;
  while ((match = itemRegex.exec(returnArray)) !== null) {
    items.push({ label: match[1], value: match[2].trim().replace(/,\s*$/, '') });
  }
  
  if (items.length === 0) continue;
  
  // Build the new function
  const newFunc = `function calculate() {
  ${calcLogic}

  const _results = [
${items.map(item => `    { label: '${item.label}', value: ${item.value} }`).join(',\n')}
  ];

  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');

  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.9rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');

  resultBox.style.display = 'block';
}`;

  // Fix button class in form part
  const fixedForm = formPart.replace(/class="btn"/g, 'class="calc-btn"');
  
  fs.writeFileSync(file, fixedForm + newFunc + '\n');
  fixed++;
  console.log(`Fixed: ${file} (${items.length} result items)`);
}

console.log(`\nTotal fixed: ${fixed}`);
