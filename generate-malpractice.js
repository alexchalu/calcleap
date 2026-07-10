const fs = require('fs');
const path = require('path');

const dir = 'malpractice';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const states = [
  { abbr:'AL', name:'Alabama', slug:'alabama', cap:'No Cap', sol:'2 years', avgSettlement:425000, avgPremium:45000, filings:850, medianIncome:54943, popRank:24 },
  { abbr:'AK', name:'Alaska', slug:'alaska', cap:'Non-economic: $400K', sol:'2 years', avgSettlement:390000, avgPremium:38000, filings:120, medianIncome:77640, popRank:48 },
  { abbr:'AZ', name:'Arizona', slug:'arizona', cap:'No Cap', sol:'2 years', avgSettlement:485000, avgPremium:42000, filings:1200, medianIncome:65913, popRank:14 },
  { abbr:'AR', name:'Arkansas', slug:'arkansas', cap:'No Cap', sol:'2 years', avgSettlement:380000, avgPremium:40000, filings:600, medianIncome:52528, popRank:34 },
  { abbr:'CA', name:'California', slug:'california', cap:'Non-economic: $350K (MICRA, increasing)', sol:'1 year (3 yr discovery)', avgSettlement:680000, avgPremium:55000, filings:4500, medianIncome:84097, popRank:1 },
  { abbr:'CO', name:'Colorado', slug:'colorado', cap:'$300K non-economic (adjustable)', sol:'2 years', avgSettlement:510000, avgPremium:43000, filings:950, medianIncome:82254, popRank:21 },
  { abbr:'CT', name:'Connecticut', slug:'connecticut', cap:'No Cap', sol:'2 years', avgSettlement:560000, avgPremium:48000, filings:800, medianIncome:83771, popRank:29 },
  { abbr:'DE', name:'Delaware', slug:'delaware', cap:'No Cap', sol:'2 years', avgSettlement:490000, avgPremium:44000, filings:250, medianIncome:72724, popRank:45 },
  { abbr:'FL', name:'Florida', slug:'florida', cap:'No Cap (caps struck down 2017)', sol:'2 years', avgSettlement:620000, avgPremium:52000, filings:3800, medianIncome:63062, popRank:3 },
  { abbr:'GA', name:'Georgia', slug:'georgia', cap:'$350K non-economic', sol:'2 years', avgSettlement:480000, avgPremium:44000, filings:2100, medianIncome:65030, popRank:8 },
  { abbr:'HI', name:'Hawaii', slug:'hawaii', cap:'$375K non-economic', sol:'2 years', avgSettlement:440000, avgPremium:39000, filings:220, medianIncome:84857, popRank:40 },
  { abbr:'ID', name:'Idaho', slug:'idaho', cap:'Non-economic: $400K (adjusted)', sol:'2 years', avgSettlement:370000, avgPremium:35000, filings:320, medianIncome:63377, popRank:38 },
  { abbr:'IL', name:'Illinois', slug:'illinois', cap:'No Cap (caps struck down)', sol:'2 years', avgSettlement:590000, avgPremium:50000, filings:2800, medianIncome:72205, popRank:6 },
  { abbr:'IN', name:'Indiana', slug:'indiana', cap:'$1.8M total cap (qualified providers)', sol:'2 years', avgSettlement:450000, avgPremium:41000, filings:1100, medianIncome:61944, popRank:17 },
  { abbr:'IA', name:'Iowa', slug:'iowa', cap:'$250K non-economic', sol:'2 years', avgSettlement:420000, avgPremium:37000, filings:550, medianIncome:65573, popRank:31 },
  { abbr:'KS', name:'Kansas', slug:'kansas', cap:'$325K non-economic', sol:'2 years', avgSettlement:410000, avgPremium:38000, filings:500, medianIncome:64521, popRank:35 },
  { abbr:'KY', name:'Kentucky', slug:'kentucky', cap:'No Cap', sol:'1 year', avgSettlement:440000, avgPremium:42000, filings:780, medianIncome:55573, popRank:26 },
  { abbr:'LA', name:'Louisiana', slug:'louisiana', cap:'$500K + future medical (qualified)', sol:'1 year (3 yr discovery)', avgSettlement:470000, avgPremium:47000, filings:1000, medianIncome:52087, popRank:25 },
  { abbr:'ME', name:'Maine', slug:'maine', cap:'No Cap', sol:'3 years', avgSettlement:410000, avgPremium:36000, filings:250, medianIncome:64767, popRank:42 },
  { abbr:'MD', name:'Maryland', slug:'maryland', cap:'$890K non-economic (adjusted yearly)', sol:'3 years (5 yr discovery)', avgSettlement:540000, avgPremium:46000, filings:1200, medianIncome:87063, popRank:19 },
  { abbr:'MA', name:'Massachusetts', slug:'massachusetts', cap:'$500K non-economic (can exceed)', sol:'3 years', avgSettlement:580000, avgPremium:49000, filings:1500, medianIncome:89645, popRank:15 },
  { abbr:'MI', name:'Michigan', slug:'michigan', cap:'Non-economic: $497K (adjusted)', sol:'2 years', avgSettlement:490000, avgPremium:45000, filings:1800, medianIncome:63498, popRank:10 },
  { abbr:'MN', name:'Minnesota', slug:'minnesota', cap:'No Cap', sol:'4 years', avgSettlement:520000, avgPremium:42000, filings:900, medianIncome:77706, popRank:22 },
  { abbr:'MS', name:'Mississippi', slug:'mississippi', cap:'$500K non-economic', sol:'2 years', avgSettlement:380000, avgPremium:43000, filings:500, medianIncome:46511, popRank:33 },
  { abbr:'MO', name:'Missouri', slug:'missouri', cap:'$400K-$700K non-economic', sol:'2 years', avgSettlement:460000, avgPremium:43000, filings:1100, medianIncome:60905, popRank:18 },
  { abbr:'MT', name:'Montana', slug:'montana', cap:'$250K non-economic', sol:'3 years', avgSettlement:380000, avgPremium:35000, filings:200, medianIncome:60560, popRank:44 },
  { abbr:'NE', name:'Nebraska', slug:'nebraska', cap:'$2.25M total cap (qualified)', sol:'2 years', avgSettlement:430000, avgPremium:38000, filings:350, medianIncome:66644, popRank:37 },
  { abbr:'NV', name:'Nevada', slug:'nevada', cap:'$350K non-economic', sol:'1 year (3 yr discovery)', avgSettlement:470000, avgPremium:44000, filings:650, medianIncome:63276, popRank:32 },
  { abbr:'NH', name:'New Hampshire', slug:'new-hampshire', cap:'No Cap', sol:'3 years', avgSettlement:440000, avgPremium:38000, filings:240, medianIncome:88235, popRank:41 },
  { abbr:'NJ', name:'New Jersey', slug:'new-jersey', cap:'No Cap', sol:'2 years', avgSettlement:580000, avgPremium:50000, filings:1800, medianIncome:85245, popRank:11 },
  { abbr:'NM', name:'New Mexico', slug:'new-mexico', cap:'$600K total (qualified)', sol:'3 years', avgSettlement:420000, avgPremium:40000, filings:380, medianIncome:53992, popRank:36 },
  { abbr:'NY', name:'New York', slug:'new-york', cap:'No Cap', sol:'2.5 years', avgSettlement:720000, avgPremium:58000, filings:4200, medianIncome:74314, popRank:4 },
  { abbr:'NC', name:'North Carolina', slug:'north-carolina', cap:'$500K non-economic', sol:'3 years', avgSettlement:470000, avgPremium:42000, filings:1600, medianIncome:60516, popRank:9 },
  { abbr:'ND', name:'North Dakota', slug:'north-dakota', cap:'$500K non-economic', sol:'2 years', avgSettlement:350000, avgPremium:34000, filings:120, medianIncome:68131, popRank:47 },
  { abbr:'OH', name:'Ohio', slug:'ohio', cap:'$350K-$500K non-economic', sol:'1 year', avgSettlement:480000, avgPremium:44000, filings:2000, medianIncome:61938, popRank:7 },
  { abbr:'OK', name:'Oklahoma', slug:'oklahoma', cap:'$400K non-economic', sol:'2 years', avgSettlement:410000, avgPremium:41000, filings:650, medianIncome:56956, popRank:28 },
  { abbr:'OR', name:'Oregon', slug:'oregon', cap:'$500K non-economic (hardship override)', sol:'2 years', avgSettlement:490000, avgPremium:42000, filings:700, medianIncome:70084, popRank:27 },
  { abbr:'PA', name:'Pennsylvania', slug:'pennsylvania', cap:'No Cap', sol:'2 years', avgSettlement:570000, avgPremium:48000, filings:2500, medianIncome:67587, popRank:5 },
  { abbr:'RI', name:'Rhode Island', slug:'rhode-island', cap:'No Cap', sol:'3 years', avgSettlement:470000, avgPremium:43000, filings:220, medianIncome:71169, popRank:43 },
  { abbr:'SC', name:'South Carolina', slug:'south-carolina', cap:'$350K non-economic', sol:'3 years', avgSettlement:420000, avgPremium:40000, filings:850, medianIncome:56227, popRank:23 },
  { abbr:'SD', name:'South Dakota', slug:'south-dakota', cap:'No Cap', sol:'2 years', avgSettlement:360000, avgPremium:34000, filings:150, medianIncome:63920, popRank:46 },
  { abbr:'TN', name:'Tennessee', slug:'tennessee', cap:'$750K-$1M non-economic', sol:'1 year', avgSettlement:450000, avgPremium:43000, filings:1200, medianIncome:57153, popRank:16 },
  { abbr:'TX', name:'Texas', slug:'texas', cap:'$250K non-economic per defendant', sol:'2 years', avgSettlement:530000, avgPremium:48000, filings:3500, medianIncome:67321, popRank:2 },
  { abbr:'UT', name:'Utah', slug:'utah', cap:'$450K non-economic', sol:'2 years', avgSettlement:420000, avgPremium:37000, filings:450, medianIncome:75626, popRank:30 },
  { abbr:'VT', name:'Vermont', slug:'vermont', cap:'No Cap', sol:'3 years', avgSettlement:400000, avgPremium:36000, filings:120, medianIncome:65792, popRank:49 },
  { abbr:'VA', name:'Virginia', slug:'virginia', cap:'$2.55M total (adjusted yearly)', sol:'2 years', avgSettlement:520000, avgPremium:45000, filings:1400, medianIncome:80963, popRank:12 },
  { abbr:'WA', name:'Washington', slug:'washington', cap:'No Cap', sol:'3 years', avgSettlement:540000, avgPremium:44000, filings:1200, medianIncome:82228, popRank:13 },
  { abbr:'WV', name:'West Virginia', slug:'west-virginia', cap:'$250K non-economic', sol:'2 years', avgSettlement:390000, avgPremium:41000, filings:300, medianIncome:51615, popRank:39 },
  { abbr:'WI', name:'Wisconsin', slug:'wisconsin', cap:'$750K non-economic', sol:'3 years', avgSettlement:480000, avgPremium:42000, filings:900, medianIncome:67125, popRank:20 },
  { abbr:'WY', name:'Wyoming', slug:'wyoming', cap:'No Cap', sol:'2 years', avgSettlement:370000, avgPremium:35000, filings:100, medianIncome:65003, popRank:50 }
];

const malpracticeTypes = [
  'Surgical Errors','Misdiagnosis/Delayed Diagnosis','Medication Errors','Birth Injuries','Anesthesia Errors',
  'Emergency Room Negligence','Failure to Treat','Lab/Test Errors','Nursing Home Neglect','Dental Malpractice'
];

function generateStatePage(s) {
  const noCap = s.cap === 'No Cap';
  const capClass = noCap ? 'no-cap' : 'has-cap';
  const capBadge = noCap ? '<span class="badge good">No Damage Cap</span>' : `<span class="badge caution">Cap: ${s.cap}</span>`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s.name} Medical Malpractice Settlement Calculator 2026 | CalcLeap</title>
    <meta name="description" content="Free ${s.name} medical malpractice settlement calculator. Estimate your case value based on ${s.abbr} damage caps, statute of limitations, medical costs, and lost wages.">
    <link rel="canonical" href="https://calcleap.com/malpractice/${s.slug}.html">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${s.name} Medical Malpractice Calculator","url":"https://calcleap.com/malpractice/${s.slug}.html","applicationCategory":"FinanceApplication","operatingSystem":"Any"}</script>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif;background:#f5f5f7;color:#1d1d1f;line-height:1.6}
        .nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.72);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid rgba(0,0,0,0.1);padding:12px 20px;display:flex;justify-content:space-between;align-items:center}
        .nav a{color:#0071e3;text-decoration:none;font-weight:500;font-size:14px}
        .page{max-width:980px;margin:0 auto;padding:40px 20px 60px}
        .page-title{font-size:clamp(28px,4vw,42px);font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
        .subtitle{font-size:18px;color:#6e6e73;margin-bottom:32px}
        .card{background:#fff;border-radius:18px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:24px}
        .card h2{font-size:22px;margin-bottom:16px}
        .input-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:20px}
        .input-group{display:flex;flex-direction:column;gap:6px}
        .input-group label{font-size:14px;font-weight:600;color:#424245}
        .input-group input,.input-group select{padding:12px 14px;border:1px solid #d2d2d7;border-radius:10px;font-size:16px;font-family:inherit;background:#fff}
        .input-group input:focus,.input-group select:focus{outline:none;border-color:#0071e3;box-shadow:0 0 0 3px rgba(0,113,227,0.15)}
        .calc-btn{width:100%;padding:14px;background:#0071e3;color:#fff;border:none;border-radius:12px;font-size:17px;font-weight:600;cursor:pointer;transition:background 0.2s}
        .calc-btn:hover{background:#0077ED}
        .result-box{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:18px;padding:32px;color:#fff;margin-top:24px;display:none}
        .result-box h3{font-size:20px;margin-bottom:16px;opacity:0.9}
        .result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
        .result-card{background:rgba(255,255,255,0.15);border-radius:14px;padding:18px;text-align:center}
        .result-card .val{font-size:28px;font-weight:700;margin-bottom:4px}
        .result-card .lbl{font-size:13px;opacity:0.85}
        .bar-chart{margin-top:20px}
        .bar{display:flex;align-items:center;margin-bottom:8px}
        .bar-label{width:140px;font-size:13px;text-align:right;padding-right:12px;opacity:0.9}
        .bar-fill{height:28px;border-radius:6px;transition:width 0.8s ease;min-width:2px}
        .bar-val{font-size:13px;font-weight:600;padding-left:8px}
        .stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px}
        .stat{background:#f0f0f5;border-radius:12px;padding:16px;text-align:center}
        .stat .val{font-size:22px;font-weight:700;color:#0071e3}
        .stat .lbl{font-size:12px;color:#6e6e73;margin-top:2px}
        .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
        .badge.good{background:#e8f5e9;color:#2e7d32}
        .badge.caution{background:#fff3e0;color:#e65100}
        .info-card{background:#fff;border-radius:18px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:24px}
        .info-card h2{font-size:22px;margin-bottom:12px}
        .info-card p,.info-card li{color:#424245;margin-bottom:8px}
        .info-card ul{padding-left:20px}
        .types-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px}
        .type-card{background:#f5f5f7;border-radius:12px;padding:16px}
        .type-card h3{font-size:15px;margin-bottom:6px;color:#0071e3}
        .type-card p{font-size:13px;color:#6e6e73;margin:0}
        .faq{margin-top:12px}
        .faq details{border-bottom:1px solid #e5e5ea;padding:14px 0}
        .faq summary{font-weight:600;cursor:pointer;font-size:16px;color:#1d1d1f}
        .faq p{margin-top:10px;color:#424245}
        .state-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
        .state-links a{display:inline-block;padding:6px 14px;background:#f0f0f5;border-radius:8px;text-decoration:none;color:#0071e3;font-size:13px;font-weight:500;transition:background 0.2s}
        .state-links a:hover{background:#e0e0e5}
        .disclaimer{background:#fff3e0;border-radius:12px;padding:16px;margin-top:24px;font-size:13px;color:#795548}
        ins{display:block;margin:20px auto;border-radius:12px;overflow:hidden}
        .footer{background:#1d1d1f;color:#86868b;padding:40px 20px;text-align:center;margin-top:60px;font-size:13px}
        .footer a{color:#2997ff;text-decoration:none}
        .footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:20px;max-width:800px;margin:0 auto 20px;text-align:left}
        .footer-grid h4{color:#f5f5f7;margin-bottom:8px;font-size:13px}
        .radio-group{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
        .radio-label{padding:8px 16px;border:1px solid #d2d2d7;border-radius:8px;cursor:pointer;font-size:14px;transition:all 0.2s}
        .radio-label:has(input:checked){background:#0071e3;color:#fff;border-color:#0071e3}
        .radio-label input{display:none}
        @media(max-width:600px){.input-grid{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr}.stat-row{grid-template-columns:repeat(2,1fr)}}
    </style>
</head>
<body>
    <nav class="nav">
        <a href="https://calcleap.com/">← CalcLeap</a>
        <a href="https://calcleap.com/malpractice/">All States</a>
    </nav>
    <div class="page">
        <h1 class="page-title">${s.name} Medical Malpractice Settlement Calculator</h1>
        <p class="subtitle">Estimate your medical malpractice case value in ${s.name} (${s.abbr}). ${capBadge}</p>

        <div class="stat-row">
            <div class="stat"><div class="val">$${(s.avgSettlement/1000).toFixed(0)}K</div><div class="lbl">Avg Settlement</div></div>
            <div class="stat"><div class="val">${s.sol}</div><div class="lbl">Statute of Limitations</div></div>
            <div class="stat"><div class="val">${s.cap === 'No Cap' ? 'None' : 'Yes'}</div><div class="lbl">Damage Caps</div></div>
            <div class="stat"><div class="val">${s.filings.toLocaleString()}</div><div class="lbl">Annual Filings</div></div>
        </div>


        <div class="card">
            <h2>⚖️ Calculate Your ${s.name} Case Value</h2>
            <div class="input-grid">
                <div class="input-group">
                    <label>Total Medical Bills ($)</label>
                    <input type="number" id="medBills" placeholder="50000" value="50000">
                </div>
                <div class="input-group">
                    <label>Future Medical Costs ($)</label>
                    <input type="number" id="futureMed" placeholder="25000" value="25000">
                </div>
                <div class="input-group">
                    <label>Lost Wages ($)</label>
                    <input type="number" id="lostWages" placeholder="30000" value="30000">
                </div>
                <div class="input-group">
                    <label>Future Lost Earnings ($)</label>
                    <input type="number" id="futureEarnings" placeholder="20000" value="20000">
                </div>
                <div class="input-group">
                    <label>Injury Severity</label>
                    <select id="severity">
                        <option value="1.5">Minor (1.5x multiplier)</option>
                        <option value="2.5">Moderate (2.5x multiplier)</option>
                        <option value="4" selected>Severe (4x multiplier)</option>
                        <option value="5.5">Catastrophic (5.5x multiplier)</option>
                        <option value="7">Wrongful Death (7x multiplier)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Type of Malpractice</label>
                    <select id="malpType">
                        <option value="surgical">Surgical Errors</option>
                        <option value="misdiagnosis" selected>Misdiagnosis</option>
                        <option value="medication">Medication Errors</option>
                        <option value="birth">Birth Injuries</option>
                        <option value="anesthesia">Anesthesia Errors</option>
                        <option value="er">ER Negligence</option>
                        <option value="nursing">Nursing Home Neglect</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Attorney Fee (%)</label>
                    <select id="attFee">
                        <option value="25">25% (pre-suit)</option>
                        <option value="33" selected>33% (standard contingency)</option>
                        <option value="40">40% (if trial required)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Defendant Negligence Level</label>
                    <select id="negligence">
                        <option value="0.8">Partial (80%)</option>
                        <option value="0.9">Substantial (90%)</option>
                        <option value="1" selected>Clear (100%)</option>
                    </select>
                </div>
            </div>
            <button class="calc-btn" onclick="calculate()">Calculate Settlement Estimate</button>

            <div class="result-box" id="results">
                <h3>📊 Estimated Settlement Range for ${s.name}</h3>
                <div class="result-grid">
                    <div class="result-card"><div class="val" id="lowEst">-</div><div class="lbl">Low Estimate</div></div>
                    <div class="result-card"><div class="val" id="midEst">-</div><div class="lbl">Mid Estimate</div></div>
                    <div class="result-card"><div class="val" id="highEst">-</div><div class="lbl">High Estimate</div></div>
                    <div class="result-card"><div class="val" id="afterFees">-</div><div class="lbl">After Attorney Fees</div></div>
                </div>
                <div class="bar-chart" id="barChart"></div>
                <div id="capWarning" style="margin-top:16px;padding:12px;background:rgba(255,255,255,0.2);border-radius:10px;font-size:14px;display:none"></div>
            </div>
        </div>


        <div class="info-card">
            <h2>📋 ${s.name} Medical Malpractice Law Overview</h2>
            <p><strong>Statute of Limitations:</strong> ${s.sol}. In ${s.name}, you must file a medical malpractice claim within this period from when the injury was discovered or should have been discovered.</p>
            <p><strong>Damage Caps:</strong> ${s.cap}. ${noCap ? `${s.name} does not impose caps on damages in medical malpractice cases, meaning juries can award full compensation for both economic and non-economic damages.` : `${s.name} limits non-economic damages (pain & suffering), which may reduce your total recovery. Economic damages (medical bills, lost wages) are typically not capped.`}</p>
            <p><strong>Expert Requirements:</strong> ${s.name} requires a qualified medical expert to provide an affidavit or certificate of merit before filing a malpractice lawsuit. This expert must practice in the same or similar specialty as the defendant.</p>
            <p><strong>Modified Comparative Fault:</strong> In ${s.name}, your recovery may be reduced by your percentage of fault. If you are found more than 50% at fault, you may be barred from recovery entirely.</p>
        </div>

        <div class="info-card">
            <h2>🏥 Common Types of Medical Malpractice in ${s.name}</h2>
            <div class="types-grid">
                <div class="type-card"><h3>Surgical Errors</h3><p>Wrong-site surgery, retained instruments, nerve damage. Avg ${s.abbr} settlement: $${Math.round(s.avgSettlement*1.3/1000)}K</p></div>
                <div class="type-card"><h3>Misdiagnosis</h3><p>Delayed cancer diagnosis, missed heart attack, wrong diagnosis. Avg: $${Math.round(s.avgSettlement*0.9/1000)}K</p></div>
                <div class="type-card"><h3>Medication Errors</h3><p>Wrong drug, wrong dose, dangerous interactions. Avg: $${Math.round(s.avgSettlement*0.7/1000)}K</p></div>
                <div class="type-card"><h3>Birth Injuries</h3><p>Cerebral palsy, Erb's palsy, oxygen deprivation. Avg: $${Math.round(s.avgSettlement*2.5/1000)}K-$${Math.round(s.avgSettlement*5/1000)}K</p></div>
                <div class="type-card"><h3>Anesthesia Errors</h3><p>Over-sedation, allergic reactions, awareness during surgery. Avg: $${Math.round(s.avgSettlement*1.1/1000)}K</p></div>
                <div class="type-card"><h3>ER Negligence</h3><p>Premature discharge, delayed treatment, triage failures. Avg: $${Math.round(s.avgSettlement*0.8/1000)}K</p></div>
            </div>
        </div>

        <div class="info-card">
            <h2>💡 5 Steps to Strengthen Your ${s.name} Malpractice Case</h2>
            <ol style="padding-left:20px">
                <li style="margin-bottom:12px"><strong>Document Everything:</strong> Keep all medical records, bills, prescriptions, and correspondence. Request complete records from the healthcare provider immediately.</li>
                <li style="margin-bottom:12px"><strong>Act Within the Deadline:</strong> ${s.name}'s statute of limitations is ${s.sol}. Missing this deadline permanently bars your claim regardless of merit.</li>
                <li style="margin-bottom:12px"><strong>Get an Independent Medical Opinion:</strong> Have another qualified physician review your case. ${s.name} requires a certificate of merit from a medical expert.</li>
                <li style="margin-bottom:12px"><strong>Consult a ${s.name} Malpractice Attorney:</strong> Most work on contingency (no win, no fee). Experienced attorneys know ${s.abbr}-specific procedures and damage cap implications.</li>
                <li style="margin-bottom:12px"><strong>Don't Sign Anything:</strong> Insurance companies may pressure you into quick, low settlements. Never sign releases or give recorded statements without attorney guidance.</li>
            </ol>
        </div>

        <div class="info-card">
            <h2>❓ Frequently Asked Questions</h2>
            <div class="faq">
                <details><summary>How long do I have to file a medical malpractice lawsuit in ${s.name}?</summary><p>In ${s.name}, the statute of limitations for medical malpractice is ${s.sol} from the date of injury or discovery. Some exceptions apply for minors, fraud, or foreign objects left during surgery. Consult a ${s.name} attorney to understand your specific deadline.</p></details>
                <details><summary>${noCap ? `Does ${s.name} cap malpractice damages?` : `How do damage caps affect my ${s.name} case?`}</summary><p>${noCap ? `No, ${s.name} does not impose caps on damages in medical malpractice cases. Juries can award the full amount they determine is fair for both economic losses and pain & suffering.` : `${s.name} caps non-economic damages at ${s.cap}. This means pain and suffering awards are limited, but economic damages (medical bills, lost wages, future care costs) are typically not capped.`}</p></details>
                <details><summary>What is the average medical malpractice settlement in ${s.name}?</summary><p>The average medical malpractice settlement in ${s.name} is approximately $${(s.avgSettlement/1000).toFixed(0)},000. However, settlements vary dramatically based on injury severity, from $50,000 for minor cases to several million for birth injuries or wrongful death.</p></details>
                <details><summary>How much does a ${s.name} malpractice attorney cost?</summary><p>Most ${s.name} medical malpractice attorneys work on contingency, typically 33% of the settlement if resolved before trial and 40% if the case goes to trial. You pay nothing upfront, and if you don't win, you owe no attorney fees.</p></details>
                <details><summary>What do I need to prove in a ${s.name} malpractice case?</summary><p>In ${s.name}, you must prove four elements: (1) a doctor-patient relationship existed, (2) the provider breached the standard of care, (3) that breach directly caused your injury, and (4) you suffered quantifiable damages. Expert medical testimony is required.</p></details>
                <details><summary>Can I sue a hospital in ${s.name} for malpractice?</summary><p>Yes, hospitals in ${s.name} can be held liable for malpractice through vicarious liability (for employee doctors) or direct negligence (understaffing, equipment failures, credentialing failures). Government hospitals may have additional procedural requirements and shorter deadlines.</p></details>
            </div>
        </div>


        <div class="info-card">
            <h2>🗺️ Other State Malpractice Calculators</h2>
            <div class="state-links" id="stateLinks"></div>
        </div>

        <div class="disclaimer">⚠️ <strong>Legal Disclaimer:</strong> This calculator provides rough estimates for educational purposes only. It is NOT legal advice. Medical malpractice cases are complex and fact-specific. Actual settlements depend on many factors including evidence quality, expert testimony, jury composition, and insurance policy limits. Always consult a licensed ${s.name} medical malpractice attorney for case evaluation.</div>
    </div>

    <footer class="footer">
        <div class="footer-grid">
            <div><h4>Calculators</h4><a href="https://calcleap.com/">Home</a><br><a href="https://calcleap.com/malpractice/">Malpractice</a><br><a href="https://calcleap.com/accident/">Accident</a></div>
            <div><h4>Insurance</h4><a href="https://calcleap.com/auto-insurance/">Auto</a><br><a href="https://calcleap.com/home-insurance/">Home</a><br><a href="https://calcleap.com/life-insurance/">Life</a></div>
            <div><h4>Finance</h4><a href="https://calcleap.com/mortgage/">Mortgage</a><br><a href="https://calcleap.com/tax-refund/">Tax Refund</a><br><a href="https://calcleap.com/social-security/">Social Security</a></div>
            <div><h4>Legal</h4><a href="https://calcleap.com/">About</a><br><a href="https://calcleap.com/">Privacy</a><br><a href="https://calcleap.com/">Contact</a></div>
        </div>
        <p>© 2026 CalcLeap. Free calculators for smarter decisions.</p>
        <p style="margin-top:8px"><a href="https://calcleap.com/">CalcLeap.com</a></p>
    </footer>

    <script>
    const CAP_INFO = ${JSON.stringify({cap: s.cap, noCap})};
    const AVG_SETTLEMENT = ${s.avgSettlement};
    const ALL_STATES = ${JSON.stringify(states.map(st=>({name:st.name,slug:st.slug,abbr:st.abbr})))};
    
    // Populate state links
    const linksEl = document.getElementById('stateLinks');
    ALL_STATES.filter(st=>st.slug!=='${s.slug}').sort(()=>Math.random()-0.5).slice(0,12).sort((a,b)=>a.name.localeCompare(b.name)).forEach(st=>{
        linksEl.innerHTML += '<a href="'+st.slug+'.html">'+st.name+'</a>';
    });

    function fmt(n){return '$'+Math.round(n).toLocaleString()}

    function calculate(){
        const med = parseFloat(document.getElementById('medBills').value)||0;
        const futMed = parseFloat(document.getElementById('futureMed').value)||0;
        const wages = parseFloat(document.getElementById('lostWages').value)||0;
        const futEarn = parseFloat(document.getElementById('futureEarnings').value)||0;
        const sev = parseFloat(document.getElementById('severity').value);
        const attPct = parseFloat(document.getElementById('attFee').value)/100;
        const negl = parseFloat(document.getElementById('negligence').value);

        const economic = med + futMed + wages + futEarn;
        const nonEconomic = (med + futMed) * sev;
        let total = (economic + nonEconomic) * negl;

        // Apply state cap if applicable
        let capApplied = false;
        let cappedNonEcon = nonEconomic;
        if(!CAP_INFO.noCap){
            // Extract numeric cap
            const capMatch = CAP_INFO.cap.match(/\\$([\\.\\d,]+)/);
            if(capMatch){
                const capVal = parseFloat(capMatch[1].replace(/,/g,''))*1000;
                if(nonEconomic > capVal){ cappedNonEcon = capVal; capApplied = true; }
            }
        }
        if(capApplied) total = (economic + cappedNonEcon) * negl;

        const low = total * 0.6;
        const mid = total;
        const high = total * 1.5;
        const afterFee = mid * (1 - attPct);

        document.getElementById('lowEst').textContent = fmt(low);
        document.getElementById('midEst').textContent = fmt(mid);
        document.getElementById('highEst').textContent = fmt(high);
        document.getElementById('afterFees').textContent = fmt(afterFee);

        // Bar chart
        const max = high;
        const bars = [
            {label:'Medical Bills',val:med,color:'#667eea'},
            {label:'Future Medical',val:futMed,color:'#764ba2'},
            {label:'Lost Wages',val:wages,color:'#f093fb'},
            {label:'Future Earnings',val:futEarn,color:'#4facfe'},
            {label:'Pain & Suffering',val:cappedNonEcon,color:'#43e97b'},
            {label:'Attorney Fees',val:mid*attPct,color:'#fa709a'}
        ];
        const bc = document.getElementById('barChart');
        bc.innerHTML = '<div style="margin-top:16px;font-size:14px;font-weight:600;opacity:0.9">Settlement Breakdown</div>';
        bars.forEach(b=>{
            const pct = max>0?Math.max((b.val/max)*100,1):1;
            bc.innerHTML += '<div class="bar"><div class="bar-label">'+b.label+'</div><div class="bar-fill" style="width:'+pct+'%;background:'+b.color+'"></div><div class="bar-val" style="color:#fff">'+fmt(b.val)+'</div></div>';
        });

        // Cap warning
        const cw = document.getElementById('capWarning');
        if(capApplied){
            cw.style.display='block';
            cw.innerHTML='⚠️ <strong>${s.name} Damage Cap Applied:</strong> Non-economic damages capped at ${s.cap}. Without the cap, your non-economic damages would be '+fmt(nonEconomic)+'. The cap reduced them by '+fmt(nonEconomic-cappedNonEcon)+'.';
        } else if(!CAP_INFO.noCap){
            cw.style.display='block';
            cw.innerHTML='✅ ${s.name} has a damage cap (${s.cap}), but your estimated non-economic damages ('+fmt(nonEconomic)+') are within the cap limit.';
        } else {
            cw.style.display='block';
            cw.innerHTML='✅ ${s.name} has no damage caps. Your full non-economic damages of '+fmt(nonEconomic)+' can be awarded.';
        }

        document.getElementById('results').style.display='block';
        document.getElementById('results').scrollIntoView({behavior:'smooth',block:'start'});
    }
    </script>
</body>
</html>`;
}

// Generate index page
function generateIndex() {
  const sorted = [...states].sort((a,b)=>a.name.localeCompare(b.name));
  const noCaps = sorted.filter(s=>s.cap==='No Cap');
  const highSettlement = [...states].sort((a,b)=>b.avgSettlement-a.avgSettlement).slice(0,5);
  
  let cards = sorted.map(s=>{
    const noCap = s.cap === 'No Cap';
    return `<a href="${s.slug}.html" class="state-card" data-name="${s.slug}">
                <div class="name">${s.name}</div>
                <div class="rate">Avg: $${(s.avgSettlement/1000).toFixed(0)}K</div>
                <div class="refund">SOL: ${s.sol}</div>
                ${noCap ? '<span class="badge">No Cap</span>' : `<span class="badge cap">${s.cap.substring(0,25)}${s.cap.length>25?'...':''}</span>`}
            </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Malpractice Settlement Calculator by State 2026 | CalcLeap</title>
    <meta name="description" content="Free medical malpractice settlement calculators for all 50 US states. Compare damage caps, statute of limitations, and average settlements. Estimate your case value.">
    <link rel="canonical" href="https://calcleap.com/malpractice/">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif;background:#f5f5f7;color:#1d1d1f;line-height:1.6}
        .nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.72);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid rgba(0,0,0,0.1);padding:12px 20px}
        .nav a{color:#0071e3;text-decoration:none;font-weight:500;font-size:14px}
        .page{max-width:980px;margin:0 auto;padding:40px 20px 60px}
        .page-title{font-size:clamp(28px,4vw,42px);font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
        .subtitle{font-size:18px;color:#6e6e73;margin-bottom:32px}
        .card{background:#fff;border-radius:18px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:24px}
        .search{width:100%;padding:14px 18px;border:1px solid #d2d2d7;border-radius:12px;font-size:16px;font-family:inherit;margin-bottom:24px}
        .search:focus{outline:none;border-color:#0071e3}
        .state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
        .state-card{display:block;background:#fff;border-radius:14px;padding:18px;text-decoration:none;color:#1d1d1f;box-shadow:0 1px 6px rgba(0,0,0,0.06);transition:transform 0.2s,box-shadow 0.2s}
        .state-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.12)}
        .state-card .name{font-weight:600;font-size:16px;margin-bottom:4px}
        .state-card .rate{font-size:13px;color:#0071e3}
        .state-card .refund{font-size:13px;color:#6e6e73}
        .state-card .badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:#e8f5e9;color:#2e7d32;margin-top:4px}
        .state-card .badge.cap{background:#fff3e0;color:#e65100}
        .info-card{background:#fff;border-radius:18px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:24px}
        .info-card h2{font-size:22px;margin-bottom:12px}
        .info-card p{color:#424245;margin-bottom:10px}
        .highlight-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0}
        .highlight{background:#f0f0f5;border-radius:12px;padding:16px;text-align:center}
        .highlight .val{font-size:20px;font-weight:700;color:#0071e3}
        .highlight .lbl{font-size:12px;color:#6e6e73;margin-top:2px}
        ins{display:block;margin:20px auto;border-radius:12px;overflow:hidden}
        .footer{background:#1d1d1f;color:#86868b;padding:40px 20px;text-align:center;margin-top:60px;font-size:13px}
        .footer a{color:#2997ff;text-decoration:none}
        .footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:20px;max-width:800px;margin:0 auto 20px;text-align:left}
        .footer-grid h4{color:#f5f5f7;margin-bottom:8px;font-size:13px}
        @media(max-width:600px){.state-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}
    </style>
</head>
<body>
    <nav class="nav"><a href="https://calcleap.com/">← CalcLeap Home</a></nav>
    <div class="page">
        <h1 class="page-title">Medical Malpractice Settlement Calculator by State 2026</h1>
        <p class="subtitle">Free malpractice settlement estimators for all 50 US states. Compare damage caps, statutes of limitations, and average settlements.</p>


        <div class="info-card">
            <h2>📊 National Overview</h2>
            <div class="highlight-grid">
                <div class="highlight"><div class="val">$485K</div><div class="lbl">National Avg Settlement</div></div>
                <div class="highlight"><div class="val">${noCaps.length}</div><div class="lbl">States Without Caps</div></div>
                <div class="highlight"><div class="val">85,000+</div><div class="lbl">Annual Claims Filed</div></div>
                <div class="highlight"><div class="val">$80-150</div><div class="lbl">CPC Value Range</div></div>
            </div>
            <p><strong>Highest Average Settlements:</strong> ${highSettlement.map(s=>`${s.name} ($${(s.avgSettlement/1000).toFixed(0)}K)`).join(', ')}</p>
            <p><strong>States Without Damage Caps:</strong> ${noCaps.map(s=>s.name).join(', ')}</p>
        </div>

        <input type="text" class="search" placeholder="🔍 Search states..." oninput="filterStates(this.value)">
        <div class="state-grid" id="stateGrid">
            ${cards}
        </div>


        <div class="info-card">
            <h2>Understanding Medical Malpractice Settlements</h2>
            <p>Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care, resulting in patient injury. Settlement values depend on injury severity, medical costs, lost income, state laws, and available insurance coverage.</p>
            <p><strong>Key factors affecting your case value:</strong></p>
            <ul style="padding-left:20px">
                <li>Severity and permanence of injury</li>
                <li>Total medical expenses (past and future)</li>
                <li>Lost wages and diminished earning capacity</li>
                <li>State damage cap laws</li>
                <li>Strength of evidence and expert testimony</li>
                <li>Insurance policy limits of the provider</li>
            </ul>
        </div>
    </div>

    <footer class="footer">
        <div class="footer-grid">
            <div><h4>Calculators</h4><a href="https://calcleap.com/">Home</a><br><a href="https://calcleap.com/malpractice/">Malpractice</a><br><a href="https://calcleap.com/accident/">Accident</a></div>
            <div><h4>Insurance</h4><a href="https://calcleap.com/auto-insurance/">Auto</a><br><a href="https://calcleap.com/home-insurance/">Home</a><br><a href="https://calcleap.com/life-insurance/">Life</a></div>
            <div><h4>Finance</h4><a href="https://calcleap.com/mortgage/">Mortgage</a><br><a href="https://calcleap.com/tax-refund/">Tax Refund</a><br><a href="https://calcleap.com/social-security/">Social Security</a></div>
            <div><h4>Legal</h4><a href="https://calcleap.com/">About</a><br><a href="https://calcleap.com/">Privacy</a><br><a href="https://calcleap.com/">Contact</a></div>
        </div>
        <p>© 2026 CalcLeap. Free calculators for smarter decisions.</p>
        <p style="margin-top:8px"><a href="https://calcleap.com/">CalcLeap.com</a></p>
    </footer>

    <script>
    function filterStates(q){
        q=q.toLowerCase();
        document.querySelectorAll('.state-card').forEach(c=>{
            c.style.display=c.dataset.name.includes(q)?'':'none';
        });
    }
    </script>
</body>
</html>`;
}

// Generate all files
console.log('Generating malpractice pages...');
states.forEach(s => {
  fs.writeFileSync(path.join(dir, s.slug + '.html'), generateStatePage(s));
});
fs.writeFileSync(path.join(dir, 'index.html'), generateIndex());
console.log(`Generated ${states.length} state pages + index = ${states.length + 1} files in ${dir}/`);
