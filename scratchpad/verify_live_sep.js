// Extract computeContribution from the live HTML file and re-run TCs.
const fs = require('fs');
const html = fs.readFileSync('/home/user/calcleap/sep-ira-calculator.html', 'utf8');

// Find the primary <script> block that defines computeContribution.
// Anchor on the AUDIT comment so we don't match a stray adsbygoogle stub.
const re = /<script>\s*(\/\*[\s\S]*?AUDIT 2026-07-07[\s\S]*?function calculate[\s\S]*?)<\/script>/;
const m = html.match(re);
if (!m) { console.error('Could not find live computeContribution block'); process.exit(1); }
const body = m[1];

// Eval into a scope where we simulate document.getElementById minimally (we only need computeContribution).
const scope = {};
// Strip out the AUDIT comment; we need the actual code.
// The IIFE approach: wrap and eval.
const wrapped = `(function(){\n${body}\n return {computeContribution};})()`;
const api = eval(wrapped);

// TCs (mirror scratchpad/sep_ira_verify.js expected outputs).
const cases = [
    {tag:'TC1 W-2 mid', args:['w2', 100000, 25], expect:{contribution:25000.00}},
    {tag:'TC2 W-2 high', args:['w2', 400000, 25], expect:{contribution:72000.00, cappedByComp:true, cappedBy415:true}},
    {tag:'TC3 SE mid', args:['se', 150000, 25], expect:{contribution:27880.57,
        netSeEarnings:138525.00, seTax:21194.32, halfSeTax:10597.16}},
    {tag:'TC4 SE high', args:['se', 500000, 25], expect:{contribution:72000.00, cappedByComp:true}}
];

let pass = 0, fail = 0;
for (const {tag, args, expect} of cases) {
    const r = api.computeContribution(...args);
    let ok = true;
    for (const [k,v] of Object.entries(expect)) {
        const got = typeof r[k] === 'number' ? Number(r[k].toFixed(2)) : r[k];
        const want = typeof v === 'number' ? Number(v.toFixed(2)) : v;
        if (got !== want) { ok = false; console.log(tag + ' FAIL ' + k + ': got=' + got + ' want=' + want); }
    }
    if (ok) { console.log(tag + ' PASS contribution=' + r.contribution.toFixed(2)); pass++; }
    else fail++;
}
console.log('\n' + pass + ' PASS / ' + fail + ' FAIL');
