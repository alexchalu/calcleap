#!/usr/bin/env node
/**
 * Fix ALL broken business calculator JS files.
 * The bug: calculate() has a `return [...]` that returns results
 * instead of displaying them, followed by dead code.
 * 
 * Fix: Replace `return [` with assignment, remove dead code after.
 */
const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.js') && f.startsWith('business-calc-'));

let fixed = 0;
for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes('return [')) continue;
  
  // Find the return statement and the end of the array
  const returnIdx = code.indexOf('return [');
  
  // Find the matching ];
  let depth = 0;
  let arrayEnd = -1;
  for (let i = returnIdx + 7; i < code.length; i++) {
    if (code[i] === '[') depth++;
    if (code[i] === ']') {
      if (depth === 0) {
        // Find the semicolon
        arrayEnd = code.indexOf(';', i) + 1;
        break;
      }
      depth--;
    }
  }
  
  if (arrayEnd === -1) continue;
  
  // Everything after return [...]; is dead code — find and remove it
  // but we need the resultBox display logic
  const deadCode = code.substring(arrayEnd);
  
  // Replace the return with variable assignment
  const beforeReturn = code.substring(0, returnIdx);
  const returnArray = code.substring(returnIdx + 7, arrayEnd - 1); // the [...] content
  
  // Build new calculate function ending
  const newEnding = `const _results = [${returnArray};

  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');

  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)">' +
      '<span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span>' +
      '<span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');

  resultBox.style.display = 'block';
}
`;
  
  // Also fix button class
  const newCode = (beforeReturn + newEnding).replace(/class="btn"/g, 'class="calc-btn"');
  
  fs.writeFileSync(file, newCode);
  fixed++;
  console.log(`Fixed: ${file}`);
}

console.log(`\nTotal fixed: ${fixed}`);
