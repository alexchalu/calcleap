// Extract the live JS from roth-ira-conversion-calculator.html, wire up a fake
// document, run the 4 canonical test cases, verify exact-cent output.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
    path.join(__dirname, '..', 'roth-ira-conversion-calculator.html'),
    'utf8'
);

const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(m => m[1])
    .filter(s => s.includes('function calculate()'));

if (scriptBlocks.length !== 1) {
    console.error('FAIL: expected exactly 1 <script> block containing calculate(), got ' + scriptBlocks.length);
    process.exit(1);
}
console.log('OK: exactly 1 calculate() script block (duplicate removed)');

const fakeDoc = {
    values: {},
    getElementById(id) {
        const self = this;
        return {
            get value() { return self.values[id]; },
            set value(v) { self.values[id] = v; },
            set innerHTML(v) { self.lastHtml = v; },
            get innerHTML() { return self.lastHtml; },
            style: {}
        };
    }
};

const runner = new Function('document', scriptBlocks[0] + '; return {calculate, fedTax, taxBrackets, standardDeduction};');
const {calculate, fedTax, taxBrackets, standardDeduction} = runner(fakeDoc);

// Validate bracket constants match Rev. Proc. 2024-40 §3.01(1) — single 22% bracket
// starts at $48,475 (which is the UPPER bound of the 12% bracket in this representation).
const expectedSingle22Start = 48475;
if (taxBrackets.Single[1][1] !== expectedSingle22Start) {
    console.error('FAIL: single 22% bracket should start at ' + expectedSingle22Start + ', got ' + taxBrackets.Single[1][1]);
    process.exit(1);
}
console.log('OK: TY2025 brackets present (single 22% starts at $48,475)');

if (standardDeduction['Head of Household'] !== 22500) {
    console.error('FAIL: HoH std ded expected 22500, got ' + standardDeduction['Head of Household']);
    process.exit(1);
}
console.log('OK: TY2025 std deductions present (HoH $22,500)');

function runTC(name, inputs, expected) {
    fakeDoc.values = {
        'filing-status': inputs.fs,
        'conversion-amount': String(inputs.conv),
        'current-income': String(inputs.income),
        'pretax-ira-balance': String(inputs.p),
        'basis-nondeductible': String(inputs.b),
        'state-tax': String(inputs.stateRate)
    };
    calculate();
    const html = fakeDoc.lastHtml;
    const totalMatch = html.match(/Total tax on conversion:<\/span><span class="result-value">\$([\d.]+)</);
    const fedMatch = html.match(/Federal tax \(marginal delta\):<\/span><span class="result-value">\$([\d.]+)</);
    const stateMatch = html.match(/State tax:<\/span><span class="result-value">\$([\d.]+)</);
    const taxablePortionMatch = html.match(/Taxable portion.*?<\/span><span class="result-value">\$([\d.]+)</);
    const effRateMatch = html.match(/Effective conversion tax rate:<\/span><span class="result-value">([\d.]+)%/);

    const got = {
        total: parseFloat(totalMatch[1]),
        fed: parseFloat(fedMatch[1]),
        state: parseFloat(stateMatch[1]),
        taxablePortion: parseFloat(taxablePortionMatch[1]),
        effRate: parseFloat(effRateMatch[1])
    };
    let ok = true;
    for (const k of Object.keys(expected)) {
        if (Math.abs(got[k] - expected[k]) > 0.01) {
            console.error(`FAIL [${name}] ${k}: expected ${expected[k]}, got ${got[k]}`);
            ok = false;
        }
    }
    if (ok) console.log(`OK: ${name} — total=$${got.total}, fed=$${got.fed}, state=$${got.state}, taxable=$${got.taxablePortion}, effRate=${got.effRate}%`);
    return ok;
}

let allOk = true;
allOk &= runTC('TC1 single, no basis', {
    fs: 'Single', conv: 100000, income: 75000, p: 100000, b: 0, stateRate: 5
}, {
    total: 28133.00, fed: 23133.00, state: 5000.00, taxablePortion: 100000.00, effRate: 28.13
});
allOk &= runTC('TC2 clean backdoor Roth', {
    fs: 'Single', conv: 7500, income: 180000, p: 0, b: 7500, stateRate: 0
}, {
    total: 0.00, fed: 0.00, state: 0.00, taxablePortion: 0.00, effRate: 0.00
});
allOk &= runTC('TC3 contaminated backdoor (matches blog)', {
    fs: 'Single', conv: 7500, income: 180000, p: 50000, b: 7500, stateRate: 0
}, {
    total: 1565.22, fed: 1565.22, state: 0.00, taxablePortion: 6521.74, effRate: 20.87
});
allOk &= runTC('TC4 MFJ, no basis', {
    fs: 'Married Filing Jointly', conv: 50000, income: 200000, p: 50000, b: 0, stateRate: 6
}, {
    total: 14266.00, fed: 11266.00, state: 3000.00, taxablePortion: 50000.00, effRate: 28.53
});

if (allOk) {
    console.log('\n✓ ALL 4 TEST CASES PASS EXACT-CENT');
    process.exit(0);
} else {
    console.log('\n✗ TEST CASES FAILED');
    process.exit(1);
}
