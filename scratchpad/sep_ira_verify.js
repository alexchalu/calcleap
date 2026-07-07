// SEP-IRA math verification for evening rebuild 2026-07-07.
// Mirrors what will be in the live calculate() body.
// Constants for 2026:
const SEC415_LIMIT = 72000;      // §415(c) DC ceiling for 2026 (IRS Notice 2025-67).
const SEC401A17_CAP = 360000;    // §401(a)(17) compensation cap for 2026.
const SS_WAGE_BASE_2026 = 184500; // SSA COLA press release Oct 2025.
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const SE_FACTOR = 0.9235;        // §1402(a)(12) 92.35% factor.

function computeContribution(empType, comp, ratePct) {
    // ratePct is 0..25 (percent)
    const rate = Math.max(0, Math.min(ratePct, 25)) / 100;
    let contribution = 0;
    let maxContribution = 0;
    let compensationBase = 0;
    let seTax = 0;
    let halfSeTax = 0;
    let netSeEarnings = 0;
    let effectiveRate = rate;
    let cappedByComp = false;
    let cappedBy415 = false;

    if (empType === 'w2') {
        const cappedComp = Math.min(comp, SEC401A17_CAP);
        cappedByComp = comp > SEC401A17_CAP;
        compensationBase = cappedComp;
        const uncapped = rate * cappedComp;
        maxContribution = Math.min(uncapped, SEC415_LIMIT);
        cappedBy415 = uncapped > SEC415_LIMIT;
        contribution = maxContribution;
    } else if (empType === 'se') {
        // Sole proprietor — IRC §401(c)(2) reduced-rate algebra per IRS Pub 560 worksheet.
        netSeEarnings = comp * SE_FACTOR;
        const ssTaxable = Math.min(netSeEarnings, SS_WAGE_BASE_2026);
        seTax = ssTaxable * SS_RATE + netSeEarnings * MEDICARE_RATE;
        halfSeTax = seTax / 2;
        const adjustedNe = comp - halfSeTax;
        // For §401(a)(17) compensation cap on self-employed, use adjusted_ne (Pub 560).
        cappedByComp = adjustedNe > SEC401A17_CAP;
        const cappedAdjNe = Math.min(adjustedNe, SEC401A17_CAP);
        effectiveRate = rate / (1 + rate); // e.g. 25% -> 20%
        compensationBase = cappedAdjNe;
        const uncapped = effectiveRate * cappedAdjNe;
        maxContribution = Math.min(uncapped, SEC415_LIMIT);
        cappedBy415 = uncapped > SEC415_LIMIT;
        contribution = maxContribution;
    }
    return {contribution, maxContribution, compensationBase, effectiveRate,
            seTax, halfSeTax, netSeEarnings, cappedByComp, cappedBy415};
}

function project(current, annualContrib, r, n) {
    const growth = Math.pow(1 + r, n);
    const fvCurrent = current * growth;
    const fvAnnuity = r === 0 ? annualContrib * n : annualContrib * ((growth - 1) / r);
    return {total: fvCurrent + fvAnnuity, fvCurrent, fvAnnuity};
}

// TC1: W-2 employee, mid salary, no cap.
{
    const c = computeContribution('w2', 100000, 25);
    const p = project(30000, c.contribution, 0.07, 20);
    console.log('TC1 W-2 mid: contribution=' + c.contribution.toFixed(2)
        + ' fvCurrent=' + p.fvCurrent.toFixed(2)
        + ' fvAnnuity=' + p.fvAnnuity.toFixed(2)
        + ' total=' + p.total.toFixed(2));
}

// TC2: W-2 employee, high salary, hits §415(c) cap.
{
    const c = computeContribution('w2', 400000, 25);
    const p = project(150000, c.contribution, 0.07, 10);
    console.log('TC2 W-2 high (cap): contribution=' + c.contribution.toFixed(2)
        + ' cappedBy415=' + c.cappedBy415 + ' cappedByComp=' + c.cappedByComp
        + ' fvCurrent=' + p.fvCurrent.toFixed(2)
        + ' fvAnnuity=' + p.fvAnnuity.toFixed(2)
        + ' total=' + p.total.toFixed(2));
}

// TC3: Sole prop, mid net profit, §401(c)(2) 20% effective.
{
    const c = computeContribution('se', 150000, 25);
    const p = project(50000, c.contribution, 0.07, 15);
    console.log('TC3 SE mid: netSeEarnings=' + c.netSeEarnings.toFixed(4)
        + ' seTax=' + c.seTax.toFixed(4)
        + ' halfSeTax=' + c.halfSeTax.toFixed(4)
        + ' effRate=' + c.effectiveRate.toFixed(6)
        + ' compBase=' + c.compensationBase.toFixed(4)
        + ' contribution=' + c.contribution.toFixed(2)
        + ' fvCurrent=' + p.fvCurrent.toFixed(2)
        + ' fvAnnuity=' + p.fvAnnuity.toFixed(2)
        + ' total=' + p.total.toFixed(2));
}

// TC4 (edge): Sole prop, very high income — §415(c) cap binds.
{
    const c = computeContribution('se', 500000, 25);
    const p = project(0, c.contribution, 0.07, 5);
    console.log('TC4 SE super-high: contribution=' + c.contribution.toFixed(2)
        + ' cappedBy415=' + c.cappedBy415 + ' cappedByComp=' + c.cappedByComp);
}
