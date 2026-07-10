#!/usr/bin/env python3
"""Generate car accident settlement calculator pages for all 50 states + index."""
import os

STATES = [
    ("Alabama","AL","Birmingham"),("Alaska","AK","Anchorage"),("Arizona","AZ","Phoenix"),
    ("Arkansas","AR","Little Rock"),("California","CA","Los Angeles"),("Colorado","CO","Denver"),
    ("Connecticut","CT","Hartford"),("Delaware","DE","Wilmington"),("Florida","FL","Miami"),
    ("Georgia","GA","Atlanta"),("Hawaii","HI","Honolulu"),("Idaho","ID","Boise"),
    ("Illinois","IL","Chicago"),("Indiana","IN","Indianapolis"),("Iowa","IA","Des Moines"),
    ("Kansas","KS","Wichita"),("Kentucky","KY","Louisville"),("Louisiana","LA","New Orleans"),
    ("Maine","ME","Portland"),("Maryland","MD","Baltimore"),("Massachusetts","MA","Boston"),
    ("Michigan","MI","Detroit"),("Minnesota","MN","Minneapolis"),("Mississippi","MS","Jackson"),
    ("Missouri","MO","Kansas City"),("Montana","MT","Billings"),("Nebraska","NE","Omaha"),
    ("Nevada","NV","Las Vegas"),("New Hampshire","NH","Manchester"),("New Jersey","NJ","Newark"),
    ("New Mexico","NM","Albuquerque"),("New York","NY","New York City"),
    ("North Carolina","NC","Charlotte"),("North Dakota","ND","Fargo"),("Ohio","OH","Columbus"),
    ("Oklahoma","OK","Oklahoma City"),("Oregon","OR","Portland"),("Pennsylvania","PA","Philadelphia"),
    ("Rhode Island","RI","Providence"),("South Carolina","SC","Charleston"),
    ("South Dakota","SD","Sioux Falls"),("Tennessee","TN","Nashville"),("Texas","TX","Houston"),
    ("Utah","UT","Salt Lake City"),("Vermont","VT","Burlington"),("Virginia","VA","Richmond"),
    ("Washington","WA","Seattle"),("West Virginia","WV","Charleston"),
    ("Wisconsin","WI","Milwaukee"),("Wyoming","WY","Cheyenne"),
]

# Fault rules per state (simplified)
FAULT_RULES = {
    "AL":"contributory negligence","AK":"pure comparative fault","AZ":"pure comparative fault",
    "AR":"modified comparative (50%)","CA":"pure comparative fault","CO":"modified comparative (50%)",
    "CT":"modified comparative (51%)","DE":"modified comparative (51%)","FL":"pure comparative fault",
    "GA":"modified comparative (50%)","HI":"modified comparative (51%)","ID":"modified comparative (50%)",
    "IL":"modified comparative (50%)","IN":"modified comparative (51%)","IA":"modified comparative (50%)",
    "KS":"modified comparative (50%)","KY":"pure comparative fault","LA":"pure comparative fault",
    "ME":"modified comparative (50%)","MD":"contributory negligence","MA":"modified comparative (51%)",
    "MI":"modified comparative (50%)","MN":"modified comparative (50%)","MS":"pure comparative fault",
    "MO":"pure comparative fault","MT":"modified comparative (51%)","NE":"modified comparative (50%)",
    "NV":"modified comparative (51%)","NH":"modified comparative (51%)","NJ":"modified comparative (50%)",
    "NM":"pure comparative fault","NY":"pure comparative fault","NC":"contributory negligence",
    "ND":"modified comparative (50%)","OH":"modified comparative (51%)","OK":"modified comparative (51%)",
    "OR":"modified comparative (51%)","PA":"modified comparative (51%)","RI":"pure comparative fault",
    "SC":"modified comparative (51%)","SD":"slight/gross negligence","TN":"modified comparative (50%)",
    "TX":"modified comparative (51%)","UT":"modified comparative (50%)","VT":"modified comparative (51%)",
    "VA":"contributory negligence","WA":"pure comparative fault","WV":"modified comparative (50%)",
    "WI":"modified comparative (51%)","WY":"modified comparative (51%)",
}

SOL = {
    "AL":"2 years","AK":"2 years","AZ":"2 years","AR":"3 years","CA":"2 years","CO":"3 years",
    "CT":"2 years","DE":"2 years","FL":"4 years","GA":"2 years","HI":"2 years","ID":"2 years",
    "IL":"2 years","IN":"2 years","IA":"2 years","KS":"2 years","KY":"1 year","LA":"1 year",
    "ME":"6 years","MD":"3 years","MA":"3 years","MI":"3 years","MN":"6 years","MS":"3 years",
    "MO":"5 years","MT":"3 years","NE":"4 years","NV":"2 years","NH":"3 years","NJ":"2 years",
    "NM":"3 years","NY":"3 years","NC":"3 years","ND":"6 years","OH":"2 years","OK":"2 years",
    "OR":"2 years","PA":"2 years","RI":"3 years","SC":"3 years","SD":"3 years","TN":"1 year",
    "TX":"2 years","UT":"4 years","VT":"3 years","VA":"2 years","WA":"3 years","WV":"2 years",
    "WI":"3 years","WY":"4 years",
}

STYLE = """
/* === CalcLeap Apple Design System === */
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --white:#fff;--bg:#f5f5f7;--surface:#fff;
  --border:rgba(0,0,0,.08);--border-hover:rgba(0,0,0,.15);
  --text:#1d1d1f;--text-2:#424245;--text-3:#86868b;
  --accent:#0071e3;--accent-hover:#0077ED;--accent-bg:rgba(0,113,227,.06);
  --shadow:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 8px 30px rgba(0,0,0,.08);
  --r:16px;--r-sm:12px;--r-xs:8px;
  --mw:980px;
  --font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.5}
a{color:inherit;text-decoration:none}
.nav{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}
.logo{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}.logo span{color:var(--accent)}
.nav-links{display:flex;gap:.15rem}
.nav-links a{font-size:.8rem;color:var(--text-3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}
.nav-links a:hover{color:var(--text);background:rgba(0,0,0,.04)}
.page{max-width:var(--mw);margin:0 auto;padding:0 2rem}
.breadcrumb{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text-3)}
.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--accent)}
.breadcrumb .sep{margin:0 .35rem;opacity:.4}
.page-title{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}
.page-desc{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:600px}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.card h2{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.form-group{display:flex;flex-direction:column;gap:.3rem}
.form-group label{font-size:.78rem;font-weight:600;color:var(--text-2);letter-spacing:.02em;text-transform:uppercase}
.form-group input,.form-group select{padding:.7rem .85rem;font-size:.95rem;font-family:var(--font);background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);color:var(--text);outline:none;transition:all .2s}
.form-group input:focus,.form-group select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1);background:var(--white)}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;transition:all .2s;margin-top:.5rem}
.btn:hover{background:var(--accent-hover);box-shadow:0 4px 12px rgba(0,113,227,.3)}
.result-area{display:none;margin-top:1.5rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem}
.result-item{text-align:center;padding:1rem;background:var(--white);border-radius:var(--r-xs);border:1px solid var(--border)}
.result-item .label{font-size:.72rem;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.25rem}
.result-item .value{font-size:1.5rem;font-weight:700;letter-spacing:-.03em;color:var(--accent)}
.result-item .value.green{color:#34c759}.result-item .value.red{color:#ff3b30}
.info-section{margin-top:2.5rem;margin-bottom:3rem}
.info-section h2{font-size:1.3rem;font-weight:700;margin-bottom:1rem;letter-spacing:-.02em}
.info-section h3{font-size:1.05rem;font-weight:700;margin:1.25rem 0 .5rem}
.info-section p{color:var(--text-2);line-height:1.7;margin-bottom:.75rem;font-size:.95rem}
.info-section ul{margin:.5rem 0 1rem 1.5rem;color:var(--text-2);font-size:.95rem}
.info-section ul li{margin-bottom:.35rem}
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem;margin:1.5rem 0}
.state-link{display:block;padding:.75rem 1rem;background:var(--white);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.9rem;font-weight:500;color:var(--text);transition:all .15s}
.state-link:hover{border-color:var(--accent);color:var(--accent);box-shadow:var(--shadow)}
footer{text-align:center;padding:2rem;font-size:.78rem;color:var(--text-3);border-top:1px solid var(--border);margin-top:2rem}
footer a{color:var(--accent)}
@media(max-width:600px){.form-row{grid-template-columns:1fr}.page-title{font-size:1.6rem}.result-grid{grid-template-columns:1fr 1fr}}
.ad-slot{min-height:90px;margin:1.5rem 0;text-align:center;overflow:hidden}
"""

NAV = """<nav class="nav"><div class="nav-inner">
<a href="/" class="logo">Calc<span>Leap</span></a>
<div class="nav-links">
<a href="/mortgage-calculator.html">Mortgage</a>
<a href="/income-tax-calculator.html">Tax</a>
<a href="/calc/retirement-calculator.html">Retirement</a>
<a href="/accident/">Accident</a>
</div></div></nav>"""

def slug(name):
    return name.lower().replace(" ","-")

def gen_state(name, abbr, city):
    fault = FAULT_RULES.get(abbr, "comparative fault")
    sol = SOL.get(abbr, "2 years")
    sl = slug(name)
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} Car Accident Settlement Calculator | CalcLeap</title>
<meta name="description" content="Estimate your car accident settlement in {name} ({abbr}). Calculate medical bills, lost wages, pain & suffering with {name}'s {fault} laws. Free {abbr} accident calculator.">
<link rel="canonical" href="https://calcleap.com/accident/{sl}.html">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<meta property="og:type" content="website">
<meta property="og:url" content="https://calcleap.com/accident/{sl}.html">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"WebApplication","name":"{name} Car Accident Settlement Calculator","description":"Estimate car accident settlement value in {name}","url":"https://calcleap.com/accident/{sl}.html","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{{"@type":"Offer","price":"0","priceCurrency":"USD"}}}}
</script>
<style>{STYLE}</style>
</head>
<body>
{NAV}
<main class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span><a href="/accident/">Accident Settlement</a><span class="sep">›</span>{name}</div>
<h1 class="page-title">{name} Car Accident Settlement Calculator</h1>
<p class="page-desc">Estimate your potential car accident settlement in {name} based on medical expenses, lost income, pain & suffering multiplier, and {abbr}'s {fault} laws.</p>



<div class="card">
<h2>Calculate Your Settlement Estimate</h2>
<div class="form-row">
<div class="form-group"><label>Medical Bills ($)</label><input type="number" id="medical" placeholder="15,000" min="0"></div>
<div class="form-group"><label>Future Medical Costs ($)</label><input type="number" id="futureMed" placeholder="5,000" min="0"></div>
</div>
<div class="form-row">
<div class="form-group"><label>Lost Wages ($)</label><input type="number" id="wages" placeholder="8,000" min="0"></div>
<div class="form-group"><label>Future Lost Earnings ($)</label><input type="number" id="futureWages" placeholder="0" min="0"></div>
</div>
<div class="form-row">
<div class="form-group"><label>Property Damage ($)</label><input type="number" id="property" placeholder="5,000" min="0"></div>
<div class="form-group"><label>Injury Severity</label>
<select id="severity">
<option value="1.5">Minor (soft tissue)</option>
<option value="2.5" selected>Moderate (fractures, disc injury)</option>
<option value="4">Serious (surgery required)</option>
<option value="5">Severe (permanent disability)</option>
<option value="7">Catastrophic (TBI, paralysis)</option>
</select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Your Fault % (0-100)</label><input type="number" id="fault" value="0" min="0" max="100"></div>
<div class="form-group"><label>Attorney Fees %</label>
<select id="attorney">
<option value="0">No attorney (0%)</option>
<option value="33.3" selected>Contingency (33.3%)</option>
<option value="40">Litigation (40%)</option>
</select></div>
</div>
<button class="btn" onclick="calc()">Calculate Settlement</button>

<div class="result-area" id="results">
<div class="result-grid">
<div class="result-item"><div class="label">Total Damages</div><div class="value" id="rTotal">$0</div></div>
<div class="result-item"><div class="label">Pain & Suffering</div><div class="value" id="rPain">$0</div></div>
<div class="result-item"><div class="label">Fault Reduction</div><div class="value red" id="rFault">$0</div></div>
<div class="result-item"><div class="label">Attorney Fees</div><div class="value red" id="rFees">$0</div></div>
<div class="result-item"><div class="label">Low Estimate</div><div class="value" id="rLow">$0</div></div>
<div class="result-item"><div class="label">Estimated Settlement</div><div class="value green" id="rSettle">$0</div></div>
</div>
</div>
</div>



<div class="info-section">
<h2>{name} Car Accident Settlement Laws</h2>
<p>{name} follows <strong>{fault}</strong> rules for personal injury claims. The statute of limitations for filing a car accident lawsuit in {abbr} is <strong>{sol}</strong> from the date of the accident.</p>

<h3>How {name} Fault Rules Affect Your Settlement</h3>
<p>Under {name}'s {fault} system, your compensation may be reduced or barred based on your percentage of fault in the accident.''' + ('''
<p><strong>Important:</strong> In ''' + name + ''', if you are even 1% at fault, you may be completely barred from recovering any compensation under the contributory negligence doctrine. This is one of the strictest standards in the country.</p>''' if "contributory" in fault else ('''
<p>Under pure comparative fault, you can recover damages even if you are 99% at fault, though your award is reduced by your fault percentage.</p>''' if "pure" in fault else '''
<p>You can recover damages as long as your fault does not exceed the threshold. If it does, you receive nothing.</p>''')) + f'''

<h3>Average Car Accident Settlements in {name}</h3>
<ul>
<li><strong>Minor injuries (whiplash, sprains):</strong> $5,000 – $25,000</li>
<li><strong>Moderate injuries (fractures, disc herniation):</strong> $25,000 – $100,000</li>
<li><strong>Serious injuries (surgery, long recovery):</strong> $100,000 – $500,000</li>
<li><strong>Severe/catastrophic (TBI, spinal cord):</strong> $500,000 – $5,000,000+</li>
</ul>

<h3>What Affects Your {abbr} Settlement Value?</h3>
<ul>
<li>Total medical expenses (past and future)</li>
<li>Lost wages and diminished earning capacity</li>
<li>Pain and suffering multiplier (typically 1.5x to 5x medical costs)</li>
<li>Your percentage of fault under {name}'s {fault} rules</li>
<li>Insurance policy limits of the at-fault driver</li>
<li>Quality of evidence (photos, police report, witnesses)</li>
<li>Whether you hired an attorney</li>
</ul>

<h3>Steps After a Car Accident in {name}</h3>
<ul>
<li>Call 911 and get a police report filed</li>
<li>Seek immediate medical attention (even if injuries seem minor)</li>
<li>Document everything: photos, witness info, medical records</li>
<li>Do NOT give a recorded statement to the other driver's insurance</li>
<li>Consult a {name} personal injury attorney within the {sol} statute of limitations</li>
<li>Keep all receipts for medical bills, prescriptions, and lost work</li>
</ul>

<p><strong>Disclaimer:</strong> This calculator provides estimates only and should not be considered legal advice. Actual settlement values depend on many factors unique to your case. Consult a licensed {name} attorney for personalized guidance.</p>
</div>

<div class="card">
<h2>Car Accident Settlement Calculators by State</h2>
<div class="state-grid">''' + "".join(f'<a class="state-link" href="/accident/{slug(s[0])}.html">🚗 {s[0]}</a>' for s in STATES) + '''</div>
</div>
</main>
<footer>© 2026 <a href="/">CalcLeap</a> · <a href="/privacy.html">Privacy</a></footer>
<script>
const $ = id => document.getElementById(id);
const fmt = n => "$" + n.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});
function calc(){
  const med = +$("medical").value||0;
  const fmed = +$("futureMed").value||0;
  const wage = +$("wages").value||0;
  const fwage = +$("futureWages").value||0;
  const prop = +$("property").value||0;
  const sev = +$("severity").value;
  const faultPct = +$("fault").value||0;
  const attPct = +$("attorney").value;
  const totalMed = med + fmed;
  const pain = totalMed * sev;
  const economic = totalMed + wage + fwage + prop;
  const gross = economic + pain;''' + ('''
  // Contributory negligence
  if(faultPct > 0){
    $("results").style.display="block";
    $("rTotal").textContent=fmt(gross);
    $("rPain").textContent=fmt(pain);
    $("rFault").textContent="BARRED (''' + name + ''' contributory negligence)";
    $("rFees").textContent="$0";$("rLow").textContent="$0";$("rSettle").textContent="$0";
    return;
  }''' if "contributory" in fault else f'''
  const faultThreshold = {"999" if "pure" in fault else "50" if "50%" in fault else "51"};
  if(faultPct >= faultThreshold && faultThreshold < 999){{
    $("results").style.display="block";
    $("rTotal").textContent=fmt(gross);
    $("rPain").textContent=fmt(pain);
    $("rFault").textContent="BARRED (exceeds {abbr} threshold)";
    $("rFees").textContent="$0";$("rLow").textContent="$0";$("rSettle").textContent="$0";
    return;
  }}''') + '''
  const afterFault = gross * (1 - faultPct/100);
  const fees = afterFault * (attPct/100);
  const net = afterFault - fees;
  const low = net * 0.7;
  $("results").style.display="block";
  $("rTotal").textContent=fmt(gross);
  $("rPain").textContent=fmt(pain);
  $("rFault").textContent="-"+fmt(gross - afterFault);
  $("rFees").textContent="-"+fmt(fees);
  $("rLow").textContent=fmt(low);
  $("rSettle").textContent=fmt(net);
}
</script>
</body></html>'''

def gen_index():
    links = "".join(f'<a class="state-link" href="/accident/{slug(s[0])}.html">🚗 {s[0]} ({s[1]})</a>' for s in STATES)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Car Accident Settlement Calculator by State | CalcLeap</title>
<meta name="description" content="Free car accident settlement calculators for all 50 states. Estimate your settlement based on medical bills, lost wages, pain & suffering, and your state's fault laws.">
<link rel="canonical" href="https://calcleap.com/accident/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"WebApplication","name":"Car Accident Settlement Calculator","description":"Estimate car accident settlement values for all 50 US states","url":"https://calcleap.com/accident/","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{{"@type":"Offer","price":"0","priceCurrency":"USD"}}}}
</script>
<style>{STYLE}</style>
</head>
<body>
{NAV}
<main class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span>Car Accident Settlement</div>
<h1 class="page-title">Car Accident Settlement Calculator</h1>
<p class="page-desc">Select your state to estimate your car accident settlement. Each calculator uses your state's specific fault rules, statute of limitations, and typical settlement ranges.</p>



<div class="card">
<h2>Choose Your State</h2>
<div class="state-grid">{links}</div>
</div>

<div class="info-section">
<h2>How Car Accident Settlements Work</h2>
<p>Car accident settlements compensate victims for damages including medical expenses, lost wages, property damage, and pain and suffering. The value of your settlement depends on several factors including the severity of your injuries, your state's fault laws, and the available insurance coverage.</p>

<h3>Settlement Calculation Method</h3>
<p>Most attorneys and insurance adjusters use a multiplier method: your total medical expenses are multiplied by a factor (typically 1.5x to 5x) based on injury severity to estimate pain and suffering damages. This is added to your economic damages (medical bills, lost wages, property damage) for a total settlement estimate.</p>

<h3>State Fault Laws Matter</h3>
<ul>
<li><strong>Pure Comparative Fault:</strong> You can recover even if 99% at fault (reduced by your %). States: AK, AZ, CA, FL, KY, LA, MS, MO, NM, NY, RI, WA</li>
<li><strong>Modified Comparative Fault:</strong> Recovery barred if your fault exceeds 50% or 51% depending on state. Most states use this system.</li>
<li><strong>Contributory Negligence:</strong> Even 1% fault bars ALL recovery. States: AL, MD, NC, VA, DC</li>
</ul>

<h3>When to Hire an Attorney</h3>
<p>Consider hiring a personal injury attorney if: your injuries required surgery or extended treatment, the insurance company disputes fault, you missed significant work time, or the settlement offer seems unreasonably low. Most personal injury attorneys work on contingency (33-40% of settlement).</p>
</div>
</main>
<footer>© 2026 <a href="/">CalcLeap</a> · <a href="/privacy.html">Privacy</a></footer>
</body></html>'''

os.makedirs("accident", exist_ok=True)

# Write index
with open("accident/index.html", "w") as f:
    f.write(gen_index())
print("✓ accident/index.html")

# Write state pages
for name, abbr, city in STATES:
    fn = f"accident/{slug(name)}.html"
    with open(fn, "w") as f:
        f.write(gen_state(name, abbr, city))
    print(f"✓ {fn}")

print(f"\nDone: {len(STATES) + 1} pages generated")
