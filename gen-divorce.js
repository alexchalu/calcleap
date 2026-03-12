#!/usr/bin/env node
// Generate 50 state divorce & child support calculator pages + index
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'divorce');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const states = [
  { abbr:'AL', name:'Alabama', cs:'income shares', filing:164, waitDays:30, fault:true, equitable:true, medianIncome:56956, avgDivorceCost:12500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'AK', name:'Alaska', cs:'income shares', filing:250, waitDays:30, fault:false, equitable:true, medianIncome:77640, avgDivorceCost:15000, csPercent1:20, csPercent2:27, csPercent3:33, alimonyFactor:'need-based' },
  { abbr:'AZ', name:'Arizona', cs:'income shares', filing:349, waitDays:60, fault:false, equitable:false, medianIncome:65913, avgDivorceCost:13500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'community property' },
  { abbr:'AR', name:'Arkansas', cs:'income shares', filing:165, waitDays:18, fault:true, equitable:true, medianIncome:52528, avgDivorceCost:11000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'CA', name:'California', cs:'income shares', filing:435, waitDays:180, fault:false, equitable:false, medianIncome:84907, avgDivorceCost:17500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'community property' },
  { abbr:'CO', name:'Colorado', cs:'income shares', filing:230, waitDays:91, fault:false, equitable:true, medianIncome:82254, avgDivorceCost:14000, csPercent1:20, csPercent2:27, csPercent3:33, alimonyFactor:'need-based' },
  { abbr:'CT', name:'Connecticut', cs:'income shares', filing:360, waitDays:90, fault:true, equitable:true, medianIncome:83771, avgDivorceCost:15500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'DE', name:'Delaware', cs:'Melson formula', filing:165, waitDays:0, fault:true, equitable:true, medianIncome:69110, avgDivorceCost:12500, csPercent1:18, csPercent2:24, csPercent3:29, alimonyFactor:'need-based' },
  { abbr:'FL', name:'Florida', cs:'income shares', filing:409, waitDays:20, fault:false, equitable:true, medianIncome:63062, avgDivorceCost:13000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'GA', name:'Georgia', cs:'income shares', filing:212, waitDays:30, fault:true, equitable:true, medianIncome:65030, avgDivorceCost:12000, csPercent1:17, csPercent2:23, csPercent3:28, alimonyFactor:'need-based' },
  { abbr:'HI', name:'Hawaii', cs:'income shares', filing:264, waitDays:0, fault:false, equitable:true, medianIncome:84857, avgDivorceCost:14000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'ID', name:'Idaho', cs:'income shares', filing:207, waitDays:20, fault:true, equitable:false, medianIncome:63377, avgDivorceCost:11500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'community property' },
  { abbr:'IL', name:'Illinois', cs:'income shares', filing:337, waitDays:180, fault:false, equitable:true, medianIncome:72205, avgDivorceCost:15000, csPercent1:20, csPercent2:28, csPercent3:32, alimonyFactor:'statutory formula' },
  { abbr:'IN', name:'Indiana', cs:'income shares', filing:157, waitDays:60, fault:true, equitable:true, medianIncome:61944, avgDivorceCost:11000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'IA', name:'Iowa', cs:'income shares', filing:265, waitDays:90, fault:false, equitable:true, medianIncome:65573, avgDivorceCost:11500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'KS', name:'Kansas', cs:'income shares', filing:176, waitDays:60, fault:true, equitable:true, medianIncome:64521, avgDivorceCost:11000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'KY', name:'Kentucky', cs:'income shares', filing:148, waitDays:60, fault:false, equitable:true, medianIncome:55573, avgDivorceCost:10500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'LA', name:'Louisiana', cs:'income shares', filing:300, waitDays:180, fault:true, equitable:false, medianIncome:54216, avgDivorceCost:12500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'community property' },
  { abbr:'ME', name:'Maine', cs:'income shares', filing:120, waitDays:60, fault:true, equitable:true, medianIncome:64767, avgDivorceCost:11000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'MD', name:'Maryland', cs:'income shares', filing:165, waitDays:0, fault:true, equitable:true, medianIncome:87063, avgDivorceCost:14000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'MA', name:'Massachusetts', cs:'income shares', filing:215, waitDays:120, fault:true, equitable:true, medianIncome:89645, avgDivorceCost:15500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'durational limits' },
  { abbr:'MI', name:'Michigan', cs:'income shares', filing:175, waitDays:60, fault:true, equitable:true, medianIncome:63498, avgDivorceCost:12000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'MN', name:'Minnesota', cs:'income shares', filing:365, waitDays:30, fault:false, equitable:true, medianIncome:77706, avgDivorceCost:14000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'MS', name:'Mississippi', cs:'percentage of income', filing:200, waitDays:60, fault:true, equitable:true, medianIncome:48610, avgDivorceCost:10000, csPercent1:14, csPercent2:20, csPercent3:22, alimonyFactor:'need-based' },
  { abbr:'MO', name:'Missouri', cs:'income shares', filing:163, waitDays:30, fault:true, equitable:true, medianIncome:60905, avgDivorceCost:11500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'MT', name:'Montana', cs:'income shares', filing:170, waitDays:20, fault:false, equitable:true, medianIncome:60560, avgDivorceCost:11000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'NE', name:'Nebraska', cs:'income shares', filing:158, waitDays:60, fault:false, equitable:true, medianIncome:66644, avgDivorceCost:11500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'NV', name:'Nevada', cs:'percentage of income', filing:364, waitDays:0, fault:false, equitable:false, medianIncome:65686, avgDivorceCost:13000, csPercent1:18, csPercent2:25, csPercent3:29, alimonyFactor:'community property' },
  { abbr:'NH', name:'New Hampshire', cs:'income shares', filing:252, waitDays:0, fault:true, equitable:true, medianIncome:83449, avgDivorceCost:12500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'NJ', name:'New Jersey', cs:'income shares', filing:325, waitDays:0, fault:true, equitable:true, medianIncome:85245, avgDivorceCost:16000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'durational limits' },
  { abbr:'NM', name:'New Mexico', cs:'income shares', filing:155, waitDays:30, fault:false, equitable:false, medianIncome:54020, avgDivorceCost:11000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'community property' },
  { abbr:'NY', name:'New York', cs:'income shares', filing:335, waitDays:0, fault:true, equitable:true, medianIncome:74314, avgDivorceCost:17000, csPercent1:17, csPercent2:25, csPercent3:29, alimonyFactor:'statutory formula' },
  { abbr:'NC', name:'North Carolina', cs:'income shares', filing:225, waitDays:365, fault:true, equitable:true, medianIncome:60516, avgDivorceCost:12500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'ND', name:'North Dakota', cs:'income shares', filing:80, waitDays:0, fault:true, equitable:true, medianIncome:68131, avgDivorceCost:10500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'OH', name:'Ohio', cs:'income shares', filing:300, waitDays:30, fault:true, equitable:true, medianIncome:61938, avgDivorceCost:12500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'OK', name:'Oklahoma', cs:'income shares', filing:183, waitDays:90, fault:true, equitable:true, medianIncome:56956, avgDivorceCost:10500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'OR', name:'Oregon', cs:'income shares', filing:301, waitDays:0, fault:false, equitable:true, medianIncome:70084, avgDivorceCost:13500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'PA', name:'Pennsylvania', cs:'income shares', filing:335, waitDays:90, fault:true, equitable:true, medianIncome:68957, avgDivorceCost:14000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'RI', name:'Rhode Island', cs:'income shares', filing:160, waitDays:0, fault:true, equitable:true, medianIncome:71169, avgDivorceCost:12000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'SC', name:'South Carolina', cs:'income shares', filing:150, waitDays:90, fault:true, equitable:true, medianIncome:59318, avgDivorceCost:11000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'SD', name:'South Dakota', cs:'income shares', filing:95, waitDays:0, fault:true, equitable:true, medianIncome:63920, avgDivorceCost:10000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'TN', name:'Tennessee', cs:'income shares', filing:299, waitDays:60, fault:true, equitable:true, medianIncome:59695, avgDivorceCost:12000, csPercent1:21, csPercent2:27, csPercent3:32, alimonyFactor:'need-based' },
  { abbr:'TX', name:'Texas', cs:'percentage of income', filing:300, waitDays:60, fault:true, equitable:false, medianIncome:67321, avgDivorceCost:15500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'community property' },
  { abbr:'UT', name:'Utah', cs:'income shares', filing:325, waitDays:90, fault:true, equitable:true, medianIncome:74197, avgDivorceCost:12000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'VT', name:'Vermont', cs:'income shares', filing:271, waitDays:90, fault:true, equitable:true, medianIncome:65792, avgDivorceCost:11500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'VA', name:'Virginia', cs:'income shares', filing:86, waitDays:180, fault:true, equitable:true, medianIncome:80615, avgDivorceCost:13500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'WA', name:'Washington', cs:'income shares', filing:314, waitDays:90, fault:false, equitable:false, medianIncome:82228, avgDivorceCost:15000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'community property' },
  { abbr:'WV', name:'West Virginia', cs:'income shares', filing:135, waitDays:0, fault:true, equitable:true, medianIncome:50884, avgDivorceCost:10000, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
  { abbr:'WI', name:'Wisconsin', cs:'percentage of income', filing:184, waitDays:120, fault:false, equitable:false, medianIncome:67125, avgDivorceCost:12000, csPercent1:17, csPercent2:25, csPercent3:29, alimonyFactor:'community property' },
  { abbr:'WY', name:'Wyoming', cs:'income shares', filing:70, waitDays:20, fault:true, equitable:true, medianIncome:65204, avgDivorceCost:10500, csPercent1:20, csPercent2:25, csPercent3:30, alimonyFactor:'need-based' },
];

const slug = s => s.toLowerCase().replace(/\s+/g,'-');

// CSS block from gold standard
const CSS = `*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#f5f5f7;--surface:#fff;--border:rgba(0,0,0,.08);--border-hover:rgba(0,0,0,.15);--text:#1d1d1f;--text-2:#424245;--text-3:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-bg:rgba(0,113,227,.06);--shadow:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 8px 30px rgba(0,0,0,.08);--r:16px;--r-sm:12px;--r-xs:8px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.5}a{color:inherit;text-decoration:none}
.nav{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}
.logo{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}.logo span{color:var(--accent)}
.nav-links{display:flex;gap:.15rem}.nav-links a{font-size:.8rem;color:var(--text-3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}.nav-links a:hover{color:var(--text);background:rgba(0,0,0,.04)}
.page{max-width:var(--mw);margin:0 auto;padding:0 2rem}
.breadcrumb{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text-3)}.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--accent)}.breadcrumb .sep{margin:0 .35rem;opacity:.4}
.page-title{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}
.page-desc{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:600px}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.card h2{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.form-group{display:flex;flex-direction:column;gap:.3rem}
.form-group label{font-size:.78rem;font-weight:600;color:var(--text-2);letter-spacing:.02em;text-transform:uppercase}
.form-group input,.form-group select{padding:.7rem .85rem;font-size:.95rem;font-family:var(--font);background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);color:var(--text);outline:none;transition:all .2s}
.form-group input:focus,.form-group select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1);background:var(--white)}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;transition:all .2s;margin-top:.5rem}.btn:hover{background:var(--accent-hover);box-shadow:0 4px 12px rgba(0,113,227,.3)}
.result-area{display:none;margin-top:1.5rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.stat-row{display:flex;justify-content:space-between;align-items:center;padding:.7rem 0;border-bottom:1px solid var(--border)}.stat-row:last-child{border-bottom:none}
.stat-label{font-size:.85rem;color:var(--text-2)}.stat-value{font-size:.95rem;font-weight:700}
.ad-slot{margin:1.5rem 0}
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;margin-bottom:1.25rem;box-shadow:var(--shadow)}
.info-card h3{font-size:1rem;font-weight:700;letter-spacing:-.015em;margin-bottom:1rem}
table{width:100%;border-collapse:separate;border-spacing:0;font-size:.875rem}
th{background:var(--bg);font-weight:600;text-align:left;padding:.6rem .85rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3)}
th:first-child{border-radius:var(--r-xs) 0 0 var(--r-xs)}th:last-child{border-radius:0 var(--r-xs) var(--r-xs) 0}
td{padding:.6rem .85rem;border-bottom:1px solid var(--border);color:var(--text-2)}
.bar-chart{margin:1rem 0}.bar{display:flex;align-items:center;margin-bottom:.5rem}.bar-label{width:120px;font-size:.8rem;color:var(--text-2);flex-shrink:0}.bar-fill{height:24px;border-radius:6px;background:linear-gradient(90deg,var(--accent),#34C759);transition:width .5s ease;position:relative;min-width:4px}.bar-value{margin-left:.5rem;font-size:.8rem;font-weight:600;color:var(--text)}
.faq{border-top:1px solid var(--border);padding:.85rem 0}.faq:last-child{border-bottom:none}.faq-q{font-size:.9rem;font-weight:600;margin-bottom:.35rem}.faq-a{font-size:.85rem;color:var(--text-2);line-height:1.65}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem}.related-link{display:block;padding:.75rem 1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);font-size:.8rem;color:var(--text-2);font-weight:500;transition:all .2s}.related-link:hover{border-color:var(--accent);color:var(--accent)}
.calc-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem;box-shadow:var(--shadow)}.calc-btn{display:inline-flex;padding:.5rem 1.25rem;font-size:.85rem;font-weight:600;background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer}.input-group{margin-bottom:.75rem}.input-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.radio-group{display:flex;gap:.5rem;flex-wrap:wrap}.radio-label{padding:.4rem 1rem;font-size:.8rem;border:1px solid var(--border);border-radius:100px;cursor:pointer;transition:all .2s}.radio-label.active,.radio-label:has(input:checked){background:var(--accent);color:#fff;border-color:var(--accent)}.radio-label input{display:none}
.result-box{background:var(--accent-bg);border:1px solid rgba(0,113,227,.15);border-radius:var(--r);padding:1.5rem;margin-top:1rem}.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.result-card{background:var(--white);border-radius:var(--r-sm);padding:1rem;text-align:center}.result-row{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)}.result-value{font-weight:700}
.converter-box{background:var(--white);padding:1.5rem;border-radius:var(--r)}.swap-btn{background:var(--bg);border:1px solid var(--border);border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:1.1rem}.rate-display{font-size:.85rem;color:var(--text-3)}.conversion-table{margin-top:1rem}
.tool-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.25rem;transition:all .2s}.tool-card:hover{box-shadow:var(--shadow-lg)}.tool-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}.tool-content{padding:.5rem 0}
.stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.25rem;text-align:center}.stat{margin-bottom:.25rem}.val{font-size:1.5rem;font-weight:800;color:var(--accent)}.lbl{font-size:.75rem;color:var(--text-3);text-transform:uppercase}
.output-area{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:1.25rem;margin-top:1rem}
.badge{display:inline-block;padding:.2rem .6rem;font-size:.7rem;font-weight:600;border-radius:100px;background:var(--accent-bg);color:var(--accent)}
.field{margin-bottom:.75rem}.row{display:flex;gap:.75rem;align-items:center}
.toggle-group{display:flex;gap:.5rem}.toggle-btn{padding:.5rem 1.25rem;font-size:.8rem;font-weight:600;font-family:var(--font);border:1px solid var(--border);border-radius:100px;background:var(--white);color:var(--text-3);cursor:pointer;transition:all .2s}.toggle-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.tab-btn{padding:.5rem 1rem;font-size:.8rem;border:none;background:transparent;color:var(--text-3);cursor:pointer;border-bottom:2px solid transparent;font-weight:600}.tab-btn.active{color:var(--accent);border-bottom-color:var(--accent)}
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem;margin:1rem 0}
.state-link{display:block;padding:.6rem .8rem;background:var(--white);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.8rem;color:var(--text-2);transition:all .15s}.state-link:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-bg)}
.footer{border-top:1px solid var(--border);margin-top:3rem;padding:2.5rem 2rem 1.5rem;background:var(--white)}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem}
.footer h5{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);margin-bottom:.65rem}
.footer p{font-size:.8rem;color:var(--text-2);line-height:1.6}
.footer a{display:block;font-size:.8rem;color:var(--text-3);padding:.2rem 0;transition:color .15s}.footer a:hover{color:var(--text)}
.footer-bottom{max-width:var(--mw);margin:0 auto;padding-top:1.5rem;border-top:1px solid var(--border);text-align:center}.footer-bottom p{font-size:.72rem;color:var(--text-3)}
@media(max-width:768px){.nav-links{display:none}.page{padding:0 1.25rem}.page-title{font-size:1.75rem}.form-row,.result-grid,.input-grid{grid-template-columns:1fr}.related-grid{grid-template-columns:1fr 1fr}.footer-inner{grid-template-columns:1fr 1fr}.state-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}}
@media(max-width:480px){.related-grid,.footer-inner,.state-grid{grid-template-columns:1fr}}`;

const NAV = `<nav class="nav"><div class="nav-inner"><a href="../index.html" class="logo">Calc<span>Leap</span></a><div class="nav-links"><a href="../index.html#finance">Finance</a><a href="../index.html#insurance">Insurance</a><a href="../index.html#tax">Tax</a><a href="../index.html#health">Health</a><a href="../index.html#converters">Converters</a><a href="index.html">Divorce</a><a href="../about.html">About</a></div></div></nav>`;

const FOOTER = `<footer class="footer"><div class="footer-inner"><div><h5>CalcLeap</h5><p>Free, professional-grade calculators for every life decision. No signup required.</p></div><div><h5>Calculators</h5><a href="../index.html#finance">Financial</a><a href="../index.html#insurance">Insurance</a><a href="../index.html#tax">Tax</a><a href="index.html">Divorce</a></div><div><h5>Resources</h5><a href="../blog/">Blog</a><a href="../about.html">About</a><a href="../privacy.html">Privacy</a></div><div><h5>Legal</h5><p style="font-size:.75rem;color:var(--text-3);line-height:1.5">This calculator provides estimates only. Not legal advice. Consult a family law attorney in your state.</p></div></div><div class="footer-bottom"><p>&copy; 2026 CalcLeap. All rights reserved.</p></div></footer>`;

const AD_SLOT = `<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({})</script></div>`;

function fmt(n) { return n.toLocaleString('en-US'); }
function fmtMoney(n) { return '$' + n.toLocaleString('en-US'); }

function getRandomStates(exclude, count=8) {
  const others = states.filter(s => s.abbr !== exclude);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateStatePage(st) {
  const propType = st.equitable ? 'Equitable Distribution' : 'Community Property';
  const faultType = st.fault ? 'Fault & No-Fault' : 'No-Fault Only';
  const waitText = st.waitDays === 0 ? 'No mandatory waiting period' : `${st.waitDays} day${st.waitDays>1?'s':''} waiting period`;
  const relatedStates = getRandomStates(st.abbr, 8);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${st.name} Divorce & Child Support Calculator — Free ${st.abbr} Estimate | CalcLeap</title>
<meta name="description" content="Calculate ${st.name} divorce costs, child support payments, and alimony estimates. Uses ${st.abbr} ${st.cs} model. Free, instant results.">
<link rel="canonical" href="https://calcleap.com/divorce/${slug(st.name)}-divorce-calculator.html">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<meta property="og:title" content="${st.name} Divorce & Child Support Calculator — CalcLeap">
<meta property="og:description" content="Estimate ${st.name} divorce costs, child support, and alimony. Free calculator using ${st.abbr} guidelines.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://calcleap.com/divorce/${slug(st.name)}-divorce-calculator.html">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebApplication","name":"${st.name} Divorce & Child Support Calculator","description":"Calculate ${st.name} divorce costs, child support payments, and alimony estimates using ${st.abbr} ${st.cs} guidelines.","url":"https://calcleap.com/divorce/${slug(st.name)}-divorce-calculator.html","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"isPartOf":{"@type":"WebSite","name":"CalcLeap","url":"https://calcleap.com"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How is child support calculated in ${st.name}?","acceptedAnswer":{"@type":"Answer","text":"${st.name} uses the ${st.cs} model for child support. Both parents' incomes are considered, along with the number of children, custody arrangement, childcare costs, and health insurance expenses. The court may adjust the guidelines amount up or down based on special circumstances."}},
{"@type":"Question","name":"How much does a divorce cost in ${st.name}?","acceptedAnswer":{"@type":"Answer","text":"The average divorce in ${st.name} costs approximately ${fmtMoney(st.avgDivorceCost)}. Filing fees alone are ${fmtMoney(st.filing)}. Contested divorces with attorneys can cost $15,000-$30,000+, while uncontested divorces may cost $1,500-$5,000."}},
{"@type":"Question","name":"Is ${st.name} a ${propType.toLowerCase()} state?","acceptedAnswer":{"@type":"Answer","text":"Yes, ${st.name} is a ${propType.toLowerCase()} state. ${st.equitable ? 'This means assets are divided fairly but not necessarily equally. Courts consider factors like marriage length, earning capacity, and contributions.' : 'This means most assets acquired during marriage are split 50/50. Separate property (owned before marriage or inherited) is not divided.'}"}},
{"@type":"Question","name":"How long does it take to get divorced in ${st.name}?","acceptedAnswer":{"@type":"Answer","text":"${st.name} has ${st.waitDays === 0 ? 'no mandatory waiting period, so an uncontested divorce can be finalized in as little as 30-60 days' : `a ${st.waitDays}-day waiting period. After that, an uncontested divorce typically takes 2-4 months`}. Contested divorces can take 6 months to 2+ years depending on the issues involved."}},
{"@type":"Question","name":"How is alimony determined in ${st.name}?","acceptedAnswer":{"@type":"Answer","text":"${st.name} uses a ${st.alimonyFactor} approach to alimony (spousal support). Courts consider marriage length, income disparity, standard of living during marriage, age and health of each spouse, and each party's contributions to the marriage. ${st.alimonyFactor === 'statutory formula' ? 'The state has a statutory formula to calculate the amount and duration.' : st.alimonyFactor === 'durational limits' ? 'The state imposes durational limits based on the length of the marriage.' : st.alimonyFactor === 'community property' ? 'As a community property state, alimony may be awarded to equalize post-divorce income.' : 'Judges have broad discretion in setting amount and duration.'}"}},
{"@type":"Question","name":"Does ${st.name} allow fault-based divorce?","acceptedAnswer":{"@type":"Answer","text":"${st.fault ? `Yes, ${st.name} allows both fault and no-fault divorce. Fault grounds may include adultery, cruelty, abandonment, or imprisonment. Filing on fault grounds may affect alimony and property division.` : `No, ${st.name} is a no-fault divorce state. You only need to cite irreconcilable differences or incompatibility. Fault is generally not considered in property division or alimony decisions.`}"}}
]}
</script>
<style>${CSS}</style>
</head>
<body>
${NAV}
<div class="page">
<div class="breadcrumb"><a href="../index.html">Home</a><span class="sep">›</span><a href="index.html">Divorce Calculators</a><span class="sep">›</span>${st.name}</div>
<h1 class="page-title">${st.name} Divorce & Child Support Calculator</h1>
<p class="page-desc">Estimate divorce costs, child support payments, and alimony in ${st.name} using ${st.abbr} guidelines. Free, instant, no signup.</p>

<!-- State Facts -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.5rem">
  <div class="stat-card"><div class="val">${fmtMoney(st.filing)}</div><div class="lbl">Filing Fee</div></div>
  <div class="stat-card"><div class="val">${waitText.replace(/\d+ days?/,'<span style="color:var(--accent)">$&</span>')}</div><div class="lbl">Wait Period</div></div>
  <div class="stat-card"><div class="val" style="font-size:1.1rem">${propType}</div><div class="lbl">Property Division</div></div>
  <div class="stat-card"><div class="val" style="font-size:1.1rem">${faultType}</div><div class="lbl">Divorce Type</div></div>
</div>

<!-- Calculator -->
<div class="card">
  <h2>Calculate Your ${st.name} Divorce Costs & Support</h2>
  <div class="form-row">
    <div class="form-group"><label>Your Annual Income</label><input type="number" id="income1" value="75000" min="0"></div>
    <div class="form-group"><label>Spouse's Annual Income</label><input type="number" id="income2" value="45000" min="0"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Number of Children</label><select id="children"><option value="0">0</option><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5+</option></select></div>
    <div class="form-group"><label>Years Married</label><input type="number" id="years" value="10" min="0" max="60"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Monthly Childcare Costs</label><input type="number" id="childcare" value="800" min="0"></div>
    <div class="form-group"><label>Monthly Health Insurance (Children)</label><input type="number" id="healthins" value="300" min="0"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Custody Arrangement</label><select id="custody"><option value="primary">Primary Custody (you)</option><option value="shared">Shared/Joint 50-50</option><option value="noncustodial">Non-Custodial (you)</option></select></div>
    <div class="form-group"><label>Divorce Complexity</label><select id="complexity"><option value="uncontested">Uncontested</option><option value="mediated">Mediated</option><option value="contested" selected>Contested</option><option value="complex">Highly Complex</option></select></div>
  </div>
  <button class="btn" onclick="calculate()">Calculate Divorce Costs & Support</button>

  <div class="result-area" id="results">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div class="result-card"><div class="lbl">Estimated Child Support</div><div class="val" id="cs-monthly" style="font-size:1.8rem;color:var(--accent)">$0</div><div class="lbl">per month</div></div>
      <div class="result-card"><div class="lbl">Estimated Alimony</div><div class="val" id="alimony-monthly" style="font-size:1.8rem;color:#34C759">$0</div><div class="lbl">per month</div></div>
    </div>
    <div class="stat-row"><span class="stat-label">Child Support (Annual)</span><span class="stat-value" id="cs-annual">$0</span></div>
    <div class="stat-row"><span class="stat-label">Alimony (Annual)</span><span class="stat-value" id="alimony-annual">$0</span></div>
    <div class="stat-row"><span class="stat-label">Alimony Duration</span><span class="stat-value" id="alimony-duration">0 years</span></div>
    <div class="stat-row"><span class="stat-label">Estimated Filing Fee</span><span class="stat-value">${fmtMoney(st.filing)}</span></div>
    <div class="stat-row"><span class="stat-label">Estimated Attorney Fees</span><span class="stat-value" id="attorney-fees">$0</span></div>
    <div class="stat-row"><span class="stat-label">Total Estimated Divorce Cost</span><span class="stat-value" id="total-cost" style="color:var(--accent);font-size:1.1rem">$0</span></div>
    <div id="bar-chart" class="bar-chart" style="margin-top:1.5rem"></div>
    <p style="margin-top:1rem;font-size:.78rem;color:var(--text-3)">⚠️ These are estimates only. Actual amounts depend on ${st.name} court decisions. Consult a family law attorney for personalized advice.</p>
  </div>
</div>

${AD_SLOT}

<!-- How It Works -->
<div class="info-card">
  <h3>How ${st.name} Child Support Is Calculated</h3>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7;margin-bottom:1rem">${st.name} uses the <strong>${st.cs}</strong> model for determining child support obligations. ${st.cs === 'income shares' ? 'Both parents\' incomes are combined to determine what would have been spent on the children if the family remained intact. Each parent\'s share is proportional to their income.' : st.cs === 'percentage of income' ? 'A percentage of the non-custodial parent\'s income is assigned based on the number of children. This is a simpler calculation but doesn\'t account for the custodial parent\'s income.' : 'This unique formula accounts for each parent\'s basic needs first, then allocates remaining income toward child support based on the number of children.'}</p>
  <table>
    <tr><th>Children</th><th>Guideline %</th><th>Approx. Monthly (at ${fmtMoney(st.medianIncome)} combined)</th></tr>
    <tr><td>1 child</td><td>${st.csPercent1}%</td><td>${fmtMoney(Math.round(st.medianIncome * st.csPercent1 / 100 / 12))}/mo</td></tr>
    <tr><td>2 children</td><td>${st.csPercent2}%</td><td>${fmtMoney(Math.round(st.medianIncome * st.csPercent2 / 100 / 12))}/mo</td></tr>
    <tr><td>3 children</td><td>${st.csPercent3}%</td><td>${fmtMoney(Math.round(st.medianIncome * st.csPercent3 / 100 / 12))}/mo</td></tr>
  </table>
</div>

<!-- Alimony -->
<div class="info-card">
  <h3>${st.name} Alimony (Spousal Support) Guidelines</h3>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7;margin-bottom:1rem">${st.name} uses a <strong>${st.alimonyFactor}</strong> approach to alimony. ${st.alimonyFactor === 'statutory formula' ? 'The state provides a statutory formula that considers the income difference between spouses and the length of the marriage to determine amount and duration.' : st.alimonyFactor === 'durational limits' ? 'The state imposes specific durational limits on alimony based on the length of the marriage. Short marriages (under 5 years) may receive little to no alimony, while long marriages (20+ years) may receive indefinite support.' : st.alimonyFactor === 'community property' ? 'As a community property state, the equal division of assets during divorce may reduce the need for alimony. However, courts can still award spousal support based on income disparity and need.' : 'Courts have broad discretion, considering factors like marriage length, income disparity, standard of living, age and health, and each party\'s contributions.'}</p>
  <table>
    <tr><th>Marriage Length</th><th>Typical Alimony Duration</th><th>Notes</th></tr>
    <tr><td>Under 5 years</td><td>0-2 years</td><td>Short-term rehabilitative</td></tr>
    <tr><td>5-10 years</td><td>2-5 years</td><td>Transitional support</td></tr>
    <tr><td>10-20 years</td><td>5-10 years</td><td>Moderate duration</td></tr>
    <tr><td>20+ years</td><td>10+ years or indefinite</td><td>Long-term/permanent possible</td></tr>
  </table>
</div>

${AD_SLOT}

<!-- Property Division -->
<div class="info-card">
  <h3>${st.name} Property Division: ${propType}</h3>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7;margin-bottom:1rem">${st.equitable ? `${st.name} follows <strong>equitable distribution</strong> rules. This means marital property is divided <em>fairly</em>, not necessarily equally. Courts consider:<br><br>• Length of the marriage<br>• Each spouse's income and earning potential<br>• Contributions to the marriage (including homemaking)<br>• Age and health of each spouse<br>• Tax consequences of division<br>• Whether either spouse dissipated assets<br><br>Separate property (owned before marriage, inherited, or gifted) is generally not divided.` : `${st.name} is a <strong>community property</strong> state. All assets and debts acquired during the marriage are typically split 50/50. This includes:<br><br>• Real estate purchased during marriage<br>• Retirement accounts earned during marriage<br>• Vehicles, investments, and business interests<br>• Credit card debt and loans<br><br>Separate property (owned before marriage, inherited, or gifted) remains with the original owner.`}</p>
</div>

<!-- Divorce Costs -->
<div class="info-card">
  <h3>What Does a Divorce Cost in ${st.name}?</h3>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7;margin-bottom:1rem">The average cost of divorce in ${st.name} is approximately <strong>${fmtMoney(st.avgDivorceCost)}</strong>. Here's the typical breakdown:</p>
  <table>
    <tr><th>Cost Category</th><th>Range</th><th>Notes</th></tr>
    <tr><td>Court Filing Fee</td><td>${fmtMoney(st.filing)}</td><td>Required to initiate proceedings</td></tr>
    <tr><td>Uncontested (no attorney)</td><td>$500-$2,500</td><td>Both parties agree on all terms</td></tr>
    <tr><td>Mediated Divorce</td><td>$3,000-$8,000</td><td>Neutral mediator helps negotiate</td></tr>
    <tr><td>Contested Divorce</td><td>$10,000-$25,000</td><td>Attorney representation required</td></tr>
    <tr><td>Highly Complex</td><td>$25,000-$100,000+</td><td>Business valuations, custody battles</td></tr>
  </table>
</div>

<!-- FAQ -->
<div class="info-card">
  <h3>Frequently Asked Questions — ${st.name} Divorce</h3>
  <div class="faq"><div class="faq-q">How is child support calculated in ${st.name}?</div><div class="faq-a">${st.name} uses the ${st.cs} model. Both parents' incomes are considered, along with custody time, childcare costs, and health insurance. The court may deviate from guidelines for special circumstances.</div></div>
  <div class="faq"><div class="faq-q">How much does a divorce cost in ${st.name}?</div><div class="faq-a">The average divorce in ${st.name} costs ${fmtMoney(st.avgDivorceCost)}. Filing fees are ${fmtMoney(st.filing)}. Uncontested divorces cost $500-$2,500, while contested cases can exceed $25,000.</div></div>
  <div class="faq"><div class="faq-q">Is ${st.name} a ${propType.toLowerCase()} state?</div><div class="faq-a">Yes. ${st.equitable ? 'Assets are divided fairly but not necessarily 50/50. Courts consider multiple factors including marriage length, income, and contributions.' : 'Marital assets are typically split 50/50. Separate property remains with the original owner.'}</div></div>
  <div class="faq"><div class="faq-q">How long does a ${st.name} divorce take?</div><div class="faq-a">${st.waitDays === 0 ? 'There is no mandatory waiting period.' : `${st.name} requires a ${st.waitDays}-day waiting period.`} Uncontested divorces typically take 2-4 months. Contested cases can take 6 months to 2+ years.</div></div>
  <div class="faq"><div class="faq-q">Does ${st.name} allow fault-based divorce?</div><div class="faq-a">${st.fault ? 'Yes. Fault grounds include adultery, cruelty, abandonment, and others. Fault may affect alimony and property division.' : 'No. ' + st.name + ' is no-fault only. You cite irreconcilable differences.'}</div></div>
  <div class="faq"><div class="faq-q">How is alimony calculated in ${st.name}?</div><div class="faq-a">${st.name} uses a ${st.alimonyFactor} approach. Courts consider income disparity, marriage length, standard of living, age, health, and each party's contributions.</div></div>
</div>

${AD_SLOT}

<!-- Related States -->
<div class="info-card">
  <h3>Divorce Calculators — Other States</h3>
  <div class="state-grid">
${relatedStates.map(rs => `    <a href="${slug(rs.name)}-divorce-calculator.html" class="state-link">${rs.name} — ${fmtMoney(rs.filing)} filing</a>`).join('\n')}
  </div>
  <p style="margin-top:1rem;text-align:center"><a href="index.html" style="color:var(--accent);font-weight:600;font-size:.85rem">View All 50 State Divorce Calculators →</a></p>
</div>

<!-- Related Tools -->
<div class="info-card">
  <h3>Related Calculators</h3>
  <div class="related-grid">
    <a href="../auto-insurance/index.html" class="related-link">Auto Insurance Calculator</a>
    <a href="../home-insurance/index.html" class="related-link">Home Insurance Calculator</a>
    <a href="../social-security/index.html" class="related-link">Social Security Calculator</a>
    <a href="../childcare/index.html" class="related-link">Childcare Cost Calculator</a>
    <a href="../disability-insurance/index.html" class="related-link">Disability Insurance</a>
    <a href="../life-insurance/index.html" class="related-link">Life Insurance Calculator</a>
  </div>
</div>

</div><!-- .page -->

${FOOTER}

<script>
function calculate() {
  const income1 = parseFloat(document.getElementById('income1').value) || 0;
  const income2 = parseFloat(document.getElementById('income2').value) || 0;
  const children = parseInt(document.getElementById('children').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 0;
  const childcare = parseFloat(document.getElementById('childcare').value) || 0;
  const healthins = parseFloat(document.getElementById('healthins').value) || 0;
  const custody = document.getElementById('custody').value;
  const complexity = document.getElementById('complexity').value;
  
  const combinedIncome = income1 + income2;
  const higherIncome = Math.max(income1, income2);
  const lowerIncome = Math.min(income1, income2);
  
  // Child support (${st.cs} model)
  let csMonthly = 0;
  if (children > 0) {
    const csPercent = children === 1 ? ${st.csPercent1} : children === 2 ? ${st.csPercent2} : ${st.csPercent3} + (children - 3) * 3;
    let baseCS = (combinedIncome * csPercent / 100) / 12;
    const payerShare = higherIncome / (combinedIncome || 1);
    baseCS = baseCS * payerShare;
    baseCS += (childcare + healthins) * payerShare;
    if (custody === 'shared') baseCS *= 0.6;
    else if (custody === 'primary') baseCS *= 0.85;
    csMonthly = Math.round(baseCS);
  }
  
  // Alimony
  let alimonyMonthly = 0;
  let alimonyYears = 0;
  const incomeDiff = higherIncome - lowerIncome;
  if (incomeDiff > 10000 && years >= 3) {
    const alimonyRate = ${st.alimonyFactor === 'statutory formula' ? '0.30' : st.alimonyFactor === 'community property' ? '0.25' : '0.28'};
    alimonyMonthly = Math.round((incomeDiff * alimonyRate) / 12);
    if (years < 5) alimonyYears = Math.round(years * 0.3);
    else if (years < 10) alimonyYears = Math.round(years * 0.4);
    else if (years < 20) alimonyYears = Math.round(years * 0.5);
    else alimonyYears = Math.round(years * 0.6);
    if (alimonyYears < 1) alimonyYears = 1;
  }
  
  // Divorce costs
  const costMultiplier = { uncontested: 0.15, mediated: 0.5, contested: 1.0, complex: 2.0 };
  const baseCost = ${st.avgDivorceCost};
  const attorneyFees = Math.round(baseCost * costMultiplier[complexity]);
  const totalCost = ${st.filing} + attorneyFees;
  
  // Display
  document.getElementById('cs-monthly').textContent = '$' + csMonthly.toLocaleString();
  document.getElementById('alimony-monthly').textContent = '$' + alimonyMonthly.toLocaleString();
  document.getElementById('cs-annual').textContent = '$' + (csMonthly * 12).toLocaleString();
  document.getElementById('alimony-annual').textContent = '$' + (alimonyMonthly * 12).toLocaleString();
  document.getElementById('alimony-duration').textContent = alimonyYears > 0 ? alimonyYears + ' years' : 'N/A';
  document.getElementById('attorney-fees').textContent = '$' + attorneyFees.toLocaleString();
  document.getElementById('total-cost').textContent = '$' + totalCost.toLocaleString();
  
  // Bar chart
  const maxVal = Math.max(csMonthly, alimonyMonthly, totalCost / 12, 1);
  document.getElementById('bar-chart').innerHTML = '<div style="font-size:.85rem;font-weight:600;margin-bottom:.75rem">Monthly Cost Breakdown</div>' +
    '<div class="bar"><span class="bar-label">Child Support</span><div class="bar-fill" style="width:' + (csMonthly / maxVal * 100) + '%;background:var(--accent)"></div><span class="bar-value">$' + csMonthly.toLocaleString() + '/mo</span></div>' +
    '<div class="bar"><span class="bar-label">Alimony</span><div class="bar-fill" style="width:' + (alimonyMonthly / maxVal * 100) + '%;background:#34C759"></div><span class="bar-value">$' + alimonyMonthly.toLocaleString() + '/mo</span></div>' +
    '<div class="bar"><span class="bar-label">Divorce Cost</span><div class="bar-fill" style="width:' + ((totalCost/12) / maxVal * 100) + '%;background:#FF9500"></div><span class="bar-value">$' + Math.round(totalCost/12).toLocaleString() + '/mo (amortized)</span></div>';
  
  document.getElementById('results').style.display = 'block';
}
calculate();
</script>
</body>
</html>`;
}

// Generate index page
function generateIndex() {
  const sorted = [...states].sort((a, b) => a.name.localeCompare(b.name));
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Divorce & Child Support Calculator by State — All 50 States | CalcLeap</title>
<meta name="description" content="Free divorce cost, child support, and alimony calculators for all 50 US states. State-specific guidelines, filing fees, property division rules, and waiting periods.">
<link rel="canonical" href="https://calcleap.com/divorce/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CollectionPage","name":"Divorce & Child Support Calculator by State","description":"Free divorce calculators for all 50 US states with child support, alimony, and cost estimates.","url":"https://calcleap.com/divorce/","isPartOf":{"@type":"WebSite","name":"CalcLeap","url":"https://calcleap.com"}}
</script>
<style>${CSS}
.search-box{width:100%;padding:.75rem 1rem;font-size:.95rem;font-family:var(--font);border:1px solid var(--border);border-radius:var(--r-sm);background:var(--white);outline:none;margin-bottom:1.5rem}
.search-box:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1)}
.state-table-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:.5rem;padding:.7rem 1rem;border-bottom:1px solid var(--border);align-items:center;font-size:.85rem;transition:background .15s}
.state-table-row:hover{background:var(--accent-bg)}
.state-table-header{font-weight:700;font-size:.75rem;text-transform:uppercase;color:var(--text-3);background:var(--bg);border-radius:var(--r-xs);letter-spacing:.03em}
.state-table-row a{color:var(--accent);font-weight:600}
</style>
</head>
<body>
${NAV}
<div class="page">
<div class="breadcrumb"><a href="../index.html">Home</a><span class="sep">›</span>Divorce Calculators</div>
<h1 class="page-title">Divorce & Child Support Calculator by State</h1>
<p class="page-desc">Free divorce cost, child support, and alimony calculators for all 50 US states. Each state has unique rules for property division, support calculations, and filing requirements.</p>

<!-- Quick Stats -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:2rem">
  <div class="stat-card"><div class="val">50</div><div class="lbl">States Covered</div></div>
  <div class="stat-card"><div class="val">$70-$435</div><div class="lbl">Filing Fee Range</div></div>
  <div class="stat-card"><div class="val">9</div><div class="lbl">Community Property States</div></div>
  <div class="stat-card"><div class="val">17</div><div class="lbl">No-Fault Only States</div></div>
</div>

${AD_SLOT}

<input type="text" class="search-box" id="search" placeholder="Search by state name..." oninput="filterStates()">

<div class="card" style="padding:0;overflow:hidden">
<div class="state-table-row state-table-header">
  <div>State</div><div>Filing Fee</div><div>Wait Period</div><div>Property</div><div>CS Model</div>
</div>
<div id="stateList">
${sorted.map(st => `<div class="state-table-row" data-state="${st.name.toLowerCase()}"><div><a href="${slug(st.name)}-divorce-calculator.html">${st.name}</a></div><div>${fmtMoney(st.filing)}</div><div>${st.waitDays === 0 ? 'None' : st.waitDays + ' days'}</div><div>${st.equitable ? 'Equitable' : 'Community'}</div><div style="font-size:.78rem">${st.cs}</div></div>`).join('\n')}
</div>
</div>

${AD_SLOT}

<!-- Info Sections -->
<div class="info-card">
  <h3>Community Property vs. Equitable Distribution</h3>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7;margin-bottom:1rem"><strong>Community Property States (9):</strong> Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin. Assets acquired during marriage are split 50/50.</p>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7"><strong>Equitable Distribution States (41):</strong> All other states. Assets are divided "fairly" based on multiple factors — not necessarily equally.</p>
</div>

<div class="info-card">
  <h3>Child Support Models by State</h3>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7;margin-bottom:1rem"><strong>Income Shares (majority):</strong> Both parents' incomes are combined to determine support. Most common model.</p>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7;margin-bottom:1rem"><strong>Percentage of Income:</strong> Mississippi, Nevada, Texas, Wisconsin. Based on non-custodial parent's income only.</p>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7"><strong>Melson Formula:</strong> Delaware. Unique model that accounts for each parent's basic needs first.</p>
</div>

<div class="info-card">
  <h3>States With No Waiting Period</h3>
  <p style="font-size:.875rem;color:var(--text-2);line-height:1.7">The following states have no mandatory waiting period: Delaware, Hawaii, Maryland, Nevada, New Hampshire, New Jersey, New York, North Dakota, Oregon, Rhode Island, South Dakota, West Virginia. An uncontested divorce can be finalized in as little as 30-60 days in these states.</p>
</div>

${AD_SLOT}

</div>
${FOOTER}
<script>
function filterStates(){const q=document.getElementById('search').value.toLowerCase();document.querySelectorAll('#stateList .state-table-row').forEach(r=>{r.style.display=r.dataset.state.includes(q)?'':'none'})}
</script>
</body>
</html>`;
}

// Write all files
states.forEach(st => {
  const filename = `${slug(st.name)}-divorce-calculator.html`;
  fs.writeFileSync(path.join(dir, filename), generateStatePage(st));
});
fs.writeFileSync(path.join(dir, 'index.html'), generateIndex());

console.log(`✅ Generated ${states.length} state pages + 1 index = ${states.length + 1} total files in divorce/`);
