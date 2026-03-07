#!/usr/bin/env node
/**
 * MASSIVE Programmatic SEO Page Generator
 * Target: 2,000+ high-traffic calculator/converter pages
 * Model: Calculator.net (100M visits/mo) — same strategy
 */
const fs = require('fs');
const AD = 'ca-pub-3112605892426625';
const BASE = 'https://alexchalu.github.io/toolpulse';

function calcPage(slug, title, desc, keywords, calcHTML, calcJS) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Free Online Calculator | ToolPulse</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<link rel="canonical" href="${BASE}/calc/${slug}.html">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD}" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${title}","description":"${desc}","url":"${BASE}/calc/${slug}.html","applicationCategory":"UtilityApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<style>
:root{--bg:#0a0e1a;--s:#111827;--s2:#1f2937;--b:#374151;--t:#f3f4f6;--m:#9ca3af;--a:#6366f1;--a2:#4f46e5;--g:rgba(99,102,241,.12)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--t);line-height:1.6}
header{background:var(--s);border-bottom:1px solid var(--b);padding:.75rem 1.5rem;position:sticky;top:0;z-index:100}
.hi{max-width:800px;margin:0 auto;display:flex;align-items:center;gap:1rem}
.logo{font-size:1.2rem;font-weight:800;color:var(--a);text-decoration:none}
.tag{color:var(--m);font-size:.8rem;flex:1}
main{max-width:800px;margin:0 auto;padding:2rem 1.5rem}
h1{font-size:1.6rem;margin-bottom:.5rem}
.sub{color:var(--m);margin-bottom:1.5rem;font-size:.9rem}
.calc{background:var(--s);border:1px solid var(--b);border-radius:12px;padding:1.5rem}
.field{margin-bottom:1rem}
.label{display:block;font-weight:600;margin-bottom:.4rem;font-size:.85rem}
input[type="number"],input[type="text"],select{width:100%;padding:.7rem .9rem;background:var(--s2);border:1px solid var(--b);border-radius:8px;color:var(--t);font-size:.9rem;outline:none}
input:focus,select:focus{border-color:var(--a);box-shadow:0 0 0 3px var(--g)}
.row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.btn{padding:.65rem 1.2rem;background:var(--a);color:#fff;border:none;border-radius:8px;font-size:.9rem;font-weight:600;cursor:pointer}
.btn:hover{background:var(--a2)}
.result{margin-top:1.5rem;padding:1.5rem;background:var(--s2);border-radius:10px;text-align:center}
.result .val{font-size:2rem;font-weight:800;color:var(--a)}
.result .lbl{font-size:.8rem;color:var(--m);margin-top:.25rem}
.results-grid{margin-top:1.5rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.75rem}
.stat{background:var(--s2);border-radius:8px;padding:.75rem;text-align:center}
.stat .val{font-size:1.2rem;font-weight:800;color:var(--a)}
.stat .lbl{font-size:.7rem;color:var(--m)}
.ad{max-width:800px;margin:1rem auto;padding:0 1.5rem}
.info{margin-top:2rem;padding:1.5rem;background:var(--s);border:1px solid var(--b);border-radius:12px;font-size:.85rem;color:var(--m);line-height:1.8}
.info h2{color:var(--t);font-size:1.1rem;margin-bottom:.75rem}
.info h3{color:var(--a);font-size:.95rem;margin:1rem 0 .4rem}
.related{margin-top:2rem}
.related h2{font-size:1.1rem;margin-bottom:.75rem}
.rel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem}
.rel-link{background:var(--s);border:1px solid var(--b);border-radius:8px;padding:.75rem;text-decoration:none;color:var(--t);font-size:.8rem;transition:.2s}
.rel-link:hover{border-color:var(--a)}
footer{text-align:center;padding:1.5rem;color:var(--m);font-size:.8rem;border-top:1px solid var(--b);margin-top:2rem}
footer a{color:var(--a);text-decoration:none}
@media(max-width:600px){.row{grid-template-columns:1fr}.results-grid{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<header><div class="hi"><a href="../index.html" class="logo">🔧 ToolPulse</a><span class="tag">Free Online Calculators & Tools</span></div></header>
<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
<main>
<h1>${title}</h1>
<p class="sub">${desc}</p>
<div class="calc">${calcHTML}</div>
</main>
<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
<footer><a href="../index.html">ToolPulse</a> · <a href="https://alexchalu.github.io/smartcalc/">SmartCalc</a> · Free online calculators</footer>
<script>
const $=id=>document.getElementById(id);
const fmt=(n,d=2)=>typeof n==='number'?n.toLocaleString('en-US',{maximumFractionDigits:d}):'—';
${calcJS}
if(typeof calc==='function')calc();
</script>
</body>
</html>`;
}

// Ensure calc directory exists
if (!fs.existsSync(__dirname + '/calc')) fs.mkdirSync(__dirname + '/calc');

const pages = [];

// ============================================================
// CATEGORY 1: Date & Time Calculators (huge search volume)
// ============================================================
const dateCalcs = [
    { slug: 'age-calculator', title: 'Age Calculator', desc: 'Calculate your exact age in years, months, days, hours, and minutes from your date of birth.',
      keywords: 'age calculator, how old am I, date of birth calculator, age in days, exact age',
      html: `<div class="field"><label class="label">Date of Birth</label><input type="date" id="dob" value="1990-01-15"></div>
<button class="btn" onclick="calc()">Calculate Age</button>
<div class="results-grid" id="out"></div>`,
      js: `function calc(){const dob=new Date($('dob').value);const now=new Date();const diff=now-dob;const days=Math.floor(diff/864e5);const years=Math.floor(days/365.25);const months=Math.floor(days/30.44);const hours=Math.floor(diff/36e5);const weeks=Math.floor(days/7);$('out').innerHTML='<div class="stat"><div class="val">'+years+'</div><div class="lbl">Years</div></div><div class="stat"><div class="val">'+months+'</div><div class="lbl">Months</div></div><div class="stat"><div class="val">'+weeks+'</div><div class="lbl">Weeks</div></div><div class="stat"><div class="val">'+fmt(days,0)+'</div><div class="lbl">Days</div></div><div class="stat"><div class="val">'+fmt(hours,0)+'</div><div class="lbl">Hours</div></div><div class="stat"><div class="val">'+fmt(Math.floor(diff/6e4),0)+'</div><div class="lbl">Minutes</div></div>'}`
    },
    { slug: 'date-difference', title: 'Date Difference Calculator', desc: 'Calculate the number of days, weeks, months, and years between two dates.',
      keywords: 'date difference calculator, days between dates, how many days until, date calculator',
      html: `<div class="row"><div class="field"><label class="label">Start Date</label><input type="date" id="start" value="2024-01-01"></div><div class="field"><label class="label">End Date</label><input type="date" id="end" value="2026-03-07"></div></div>
<button class="btn" onclick="calc()">Calculate Difference</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const s=new Date($('start').value),e=new Date($('end').value);const d=Math.abs(e-s);const days=Math.floor(d/864e5);$('out').innerHTML='<div class="stat"><div class="val">'+Math.floor(days/365.25)+'</div><div class="lbl">Years</div></div><div class="stat"><div class="val">'+Math.floor(days/30.44)+'</div><div class="lbl">Months</div></div><div class="stat"><div class="val">'+Math.floor(days/7)+'</div><div class="lbl">Weeks</div></div><div class="stat"><div class="val">'+fmt(days,0)+'</div><div class="lbl">Days</div></div><div class="stat"><div class="val">'+fmt(days*24,0)+'</div><div class="lbl">Hours</div></div><div class="stat"><div class="val">'+fmt(days*8,0)+'</div><div class="lbl">Work Days (est)</div></div>'}`
    },
    { slug: 'days-until', title: 'Days Until Calculator', desc: 'Calculate how many days until a specific date — countdown to holidays, events, birthdays.',
      keywords: 'days until, countdown calculator, how many days until, days left, date countdown',
      html: `<div class="field"><label class="label">Target Date</label><input type="date" id="target"></div>
<button class="btn" onclick="calc()">Calculate</button><div class="result" id="out"></div>`,
      js: `$('target').value=new Date(new Date().getFullYear(),11,31).toISOString().slice(0,10);function calc(){const t=new Date($('target').value),n=new Date();n.setHours(0,0,0,0);const d=Math.ceil((t-n)/864e5);$('out').innerHTML='<div class="val">'+(d>=0?d:Math.abs(d))+'</div><div class="lbl">'+(d>=0?'days remaining':'days ago')+'</div>'}`
    },
    { slug: 'hours-calculator', title: 'Hours Calculator', desc: 'Calculate total hours and minutes between two times. Perfect for timesheets and work hour tracking.',
      keywords: 'hours calculator, time calculator, hours between times, timesheet calculator, work hours calculator',
      html: `<div class="row"><div class="field"><label class="label">Start Time</label><input type="time" id="start" value="09:00"></div><div class="field"><label class="label">End Time</label><input type="time" id="end" value="17:30"></div></div>
<div class="field"><label class="label">Break (minutes)</label><input type="number" id="brk" value="30"></div>
<button class="btn" onclick="calc()">Calculate Hours</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const[sh,sm]=$('start').value.split(':').map(Number),[eh,em]=$('end').value.split(':').map(Number);let mins=(eh*60+em)-(sh*60+sm)-($('brk').value||0);if(mins<0)mins+=1440;const h=Math.floor(mins/60),m=mins%60;$('out').innerHTML='<div class="stat"><div class="val">'+h+'h '+m+'m</div><div class="lbl">Total Time</div></div><div class="stat"><div class="val">'+(mins/60).toFixed(2)+'</div><div class="lbl">Decimal Hours</div></div><div class="stat"><div class="val">'+mins+'</div><div class="lbl">Total Minutes</div></div>'}`
    },
];

// ============================================================
// CATEGORY 2: Math Calculators
// ============================================================
const mathCalcs = [
    { slug: 'percentage-calculator', title: 'Percentage Calculator', desc: 'Calculate percentages easily — what is X% of Y, percentage increase/decrease, and percentage difference.',
      keywords: 'percentage calculator, percent calculator, percentage of a number, percentage increase, percentage decrease',
      html: `<div class="field"><label class="label">What is</label><div class="row"><div class="field"><input type="number" id="pct" value="15" placeholder="%"></div><div class="field"><label class="label">% of</label><input type="number" id="num" value="200"></div></div></div>
<button class="btn" onclick="calc()">Calculate</button>
<div class="result" id="out"></div>
<h3 style="margin:1.5rem 0 .5rem;font-size:.95rem">More Percentage Calculations</h3>
<div class="row" style="margin-bottom:.5rem"><div class="field"><input type="number" id="a1" value="50" placeholder="is what % of"><span style="font-size:.8rem;color:var(--m)"> is what % of </span><input type="number" id="a2" value="200" style="margin-top:.25rem"></div><div class="field"><div class="result" id="out2" style="padding:.5rem;margin-top:0"></div></div></div>
<div class="row"><div class="field"><input type="number" id="b1" value="100" placeholder="from"><span style="font-size:.8rem;color:var(--m)"> → </span><input type="number" id="b2" value="150" style="margin-top:.25rem"><span style="font-size:.8rem;color:var(--m)"> % change</span></div><div class="field"><div class="result" id="out3" style="padding:.5rem;margin-top:0"></div></div></div>`,
      js: `function calc(){const p=$('pct').value,$n=$('num').value;$('out').innerHTML='<div class="val">'+fmt(p/100*$n)+'</div><div class="lbl">'+p+'% of '+$n+'</div>';$('out2').innerHTML='<div class="val">'+fmt($('a1').value/$('a2').value*100,1)+'%</div>';const ch=(($('b2').value-$('b1').value)/$('b1').value*100);$('out3').innerHTML='<div class="val">'+(ch>0?'+':'')+fmt(ch,1)+'%</div>'}`
    },
    { slug: 'fraction-calculator', title: 'Fraction Calculator', desc: 'Add, subtract, multiply, and divide fractions. Shows step-by-step solutions with simplified results.',
      keywords: 'fraction calculator, fractions, add fractions, multiply fractions, simplify fractions',
      html: `<div class="row"><div class="field"><label class="label">Fraction 1</label><div class="row"><input type="number" id="n1" value="3" placeholder="numerator"><input type="number" id="d1" value="4" placeholder="denominator"></div></div><div class="field"><label class="label">Operation</label><select id="op"><option value="+">Add (+)</option><option value="-">Subtract (−)</option><option value="*">Multiply (×)</option><option value="/">Divide (÷)</option></select></div></div>
<div class="field"><label class="label">Fraction 2</label><div class="row"><input type="number" id="n2" value="1" placeholder="numerator"><input type="number" id="d2" value="2" placeholder="denominator"></div></div>
<button class="btn" onclick="calc()">Calculate</button><div class="result" id="out"></div>`,
      js: `function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
function calc(){let n1=+$('n1').value,d1=+$('d1').value,n2=+$('n2').value,d2=+$('d2').value;const op=$('op').value;let rn,rd;
if(op==='+'){rn=n1*d2+n2*d1;rd=d1*d2}else if(op==='-'){rn=n1*d2-n2*d1;rd=d1*d2}else if(op==='*'){rn=n1*n2;rd=d1*d2}else{rn=n1*d2;rd=d1*n2}
const g=gcd(rn,rd);rn/=g;rd/=g;if(rd<0){rn=-rn;rd=-rd}
$('out').innerHTML='<div class="val">'+rn+' / '+rd+'</div><div class="lbl">= '+(rn/rd).toFixed(4)+' (decimal)</div>'}`
    },
    { slug: 'square-root-calculator', title: 'Square Root Calculator', desc: 'Calculate the square root of any number. Also shows cube root, nth root, and perfect square check.',
      keywords: 'square root calculator, sqrt, cube root, nth root calculator, radical calculator',
      html: `<div class="field"><label class="label">Number</label><input type="number" id="num" value="144"></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const n=+$('num').value;const sr=Math.sqrt(n);const cr=Math.cbrt(n);const perfect=Number.isInteger(sr);$('out').innerHTML='<div class="stat"><div class="val">'+fmt(sr,6)+'</div><div class="lbl">Square Root (√)</div></div><div class="stat"><div class="val">'+fmt(cr,6)+'</div><div class="lbl">Cube Root (∛)</div></div><div class="stat"><div class="val">'+fmt(n*n,0)+'</div><div class="lbl">Squared (n²)</div></div><div class="stat"><div class="val">'+(perfect?'Yes ✅':'No')+'</div><div class="lbl">Perfect Square?</div></div>'}`
    },
    { slug: 'scientific-notation', title: 'Scientific Notation Calculator', desc: 'Convert numbers to and from scientific notation. Perform operations in scientific notation.',
      keywords: 'scientific notation calculator, scientific notation converter, standard form calculator, exponential notation',
      html: `<div class="field"><label class="label">Enter a number</label><input type="text" id="num" value="123456789"></div>
<button class="btn" onclick="calc()">Convert</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const n=parseFloat($('num').value);const exp=n.toExponential();const parts=exp.split('e');$('out').innerHTML='<div class="stat"><div class="val">'+exp+'</div><div class="lbl">Scientific Notation</div></div><div class="stat"><div class="val">'+parts[0]+' × 10<sup>'+parts[1]+'</sup></div><div class="lbl">Standard Form</div></div><div class="stat"><div class="val">'+n.toLocaleString()+'</div><div class="lbl">Standard Number</div></div>'}`
    },
    { slug: 'gpa-calculator', title: 'GPA Calculator', desc: 'Calculate your GPA (Grade Point Average). Add courses with credits and grades to get cumulative GPA.',
      keywords: 'GPA calculator, grade point average, college GPA, cumulative GPA, GPA calculator online',
      html: `<div id="courses"></div><button class="btn" onclick="addCourse()" style="margin-bottom:1rem;background:var(--s2);border:1px solid var(--b)">+ Add Course</button>
<button class="btn" onclick="calc()">Calculate GPA</button><div class="result" id="out"></div>`,
      js: `const grades={A:4,'A-':3.7,'B+':3.3,B:3,'B-':2.7,'C+':2.3,C:2,'C-':1.7,'D+':1.3,D:1,'D-':0.7,F:0};
let courseCount=0;function addCourse(){courseCount++;const d=document.createElement('div');d.className='row';d.style.marginBottom='.5rem';d.innerHTML='<div class="field"><input type="text" placeholder="Course '+ courseCount+'" style="font-size:.8rem"></div><div class="field"><select id="g'+courseCount+'" style="font-size:.8rem">'+Object.keys(grades).map(g=>'<option>'+g+'</option>').join('')+'</select></div><div class="field"><input type="number" id="c'+courseCount+'" value="3" placeholder="Credits" style="font-size:.8rem"></div>';$('courses').appendChild(d)}
for(let i=0;i<4;i++)addCourse();
function calc(){let tp=0,tc=0;for(let i=1;i<=courseCount;i++){const g=$('g'+i),c=$('c'+i);if(g&&c){tp+=grades[g.value]*(+c.value);tc+=+c.value}}const gpa=tc>0?(tp/tc):0;$('out').innerHTML='<div class="val">'+gpa.toFixed(2)+'</div><div class="lbl">Cumulative GPA ('+tc+' credits)</div>'}`
    },
];

// ============================================================
// CATEGORY 3: Health & Fitness (HIGH search volume)
// ============================================================
const healthCalcs = [
    { slug: 'bmi-calculator', title: 'BMI Calculator', desc: 'Calculate your Body Mass Index (BMI). See if you\'re underweight, normal, overweight, or obese.',
      keywords: 'BMI calculator, body mass index, BMI chart, healthy weight calculator, BMI calculator for adults',
      html: `<div class="row"><div class="field"><label class="label">Weight (lbs)</label><input type="number" id="weight" value="170"></div><div class="field"><label class="label">Height</label><div class="row"><input type="number" id="feet" value="5" placeholder="ft"><input type="number" id="inches" value="10" placeholder="in"></div></div></div>
<button class="btn" onclick="calc()">Calculate BMI</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const w=+$('weight').value;const h=+$('feet').value*12+ +$('inches').value;const bmi=(w/(h*h)*703);let cat='Normal',col='#22c55e';if(bmi<18.5){cat='Underweight';col='#3b82f6'}else if(bmi>=25&&bmi<30){cat='Overweight';col='#f59e0b'}else if(bmi>=30){cat='Obese';col='#ef4444'}
$('out').innerHTML='<div class="stat"><div class="val" style="color:'+col+'">'+bmi.toFixed(1)+'</div><div class="lbl">BMI</div></div><div class="stat"><div class="val" style="color:'+col+'">'+cat+'</div><div class="lbl">Category</div></div><div class="stat"><div class="val">'+fmt(18.5*h*h/703,0)+'-'+fmt(24.9*h*h/703,0)+'</div><div class="lbl">Healthy Range (lbs)</div></div>'}`
    },
    { slug: 'calorie-calculator', title: 'Calorie Calculator', desc: 'Calculate your daily calorie needs based on age, gender, height, weight, and activity level.',
      keywords: 'calorie calculator, daily calorie needs, TDEE calculator, how many calories, calorie intake calculator, macro calculator',
      html: `<div class="row"><div class="field"><label class="label">Age</label><input type="number" id="age" value="30"></div><div class="field"><label class="label">Gender</label><select id="gender"><option value="male">Male</option><option value="female">Female</option></select></div></div>
<div class="row"><div class="field"><label class="label">Weight (lbs)</label><input type="number" id="weight" value="170"></div><div class="field"><label class="label">Height (inches)</label><input type="number" id="height" value="70"></div></div>
<div class="field"><label class="label">Activity Level</label><select id="activity"><option value="1.2">Sedentary (office job)</option><option value="1.375" selected>Light (1-3 days/week)</option><option value="1.55">Moderate (3-5 days/week)</option><option value="1.725">Active (6-7 days/week)</option><option value="1.9">Very Active (athlete)</option></select></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const age=+$('age').value,w=+$('weight').value*0.453592,h=+$('height').value*2.54,act=+$('activity').value;const g=$('gender').value;
let bmr=g==='male'?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161;const tdee=bmr*act;
$('out').innerHTML='<div class="stat"><div class="val">'+fmt(tdee,0)+'</div><div class="lbl">Maintain Weight</div></div><div class="stat"><div class="val" style="color:#22c55e">'+fmt(tdee-500,0)+'</div><div class="lbl">Lose Weight (-1lb/wk)</div></div><div class="stat"><div class="val" style="color:#3b82f6">'+fmt(tdee+500,0)+'</div><div class="lbl">Gain Weight (+1lb/wk)</div></div><div class="stat"><div class="val">'+fmt(bmr,0)+'</div><div class="lbl">BMR</div></div><div class="stat"><div class="val">'+fmt(tdee*0.3/4,0)+'g</div><div class="lbl">Protein (30%)</div></div><div class="stat"><div class="val">'+fmt(tdee*0.4/4,0)+'g</div><div class="lbl">Carbs (40%)</div></div>'}`
    },
    { slug: 'body-fat-calculator', title: 'Body Fat Percentage Calculator', desc: 'Estimate your body fat percentage using the U.S. Navy method with simple body measurements.',
      keywords: 'body fat calculator, body fat percentage, navy body fat calculator, body composition, fat percentage calculator',
      html: `<div class="row"><div class="field"><label class="label">Gender</label><select id="gender" onchange="toggleFields()"><option value="male">Male</option><option value="female">Female</option></select></div><div class="field"><label class="label">Height (inches)</label><input type="number" id="height" value="70"></div></div>
<div class="row"><div class="field"><label class="label">Waist (inches)</label><input type="number" id="waist" value="34"></div><div class="field"><label class="label">Neck (inches)</label><input type="number" id="neck" value="15.5" step="0.1"></div></div>
<div class="field" id="hipField" style="display:none"><label class="label">Hip (inches)</label><input type="number" id="hip" value="38"></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function toggleFields(){$('hipField').style.display=$('gender').value==='female'?'':'none'}
function calc(){const g=$('gender').value,h=+$('height').value,w=+$('waist').value,n=+$('neck').value;let bf;
if(g==='male'){bf=86.010*Math.log10(w-n)-70.041*Math.log10(h)+36.76}else{const hp=+$('hip').value;bf=163.205*Math.log10(w+hp-n)-97.684*Math.log10(h)-78.387}
let cat='Athletic',col='#22c55e';if(g==='male'){if(bf>25){cat='Obese';col='#ef4444'}else if(bf>18){cat='Average';col='#f59e0b'}else if(bf>14){cat='Fit';col='#3b82f6'}}else{if(bf>32){cat='Obese';col='#ef4444'}else if(bf>25){cat='Average';col='#f59e0b'}else if(bf>21){cat='Fit';col='#3b82f6'}}
$('out').innerHTML='<div class="stat"><div class="val" style="color:'+col+'">'+bf.toFixed(1)+'%</div><div class="lbl">Body Fat</div></div><div class="stat"><div class="val" style="color:'+col+'">'+cat+'</div><div class="lbl">Category</div></div>'}`
    },
    { slug: 'pregnancy-due-date', title: 'Pregnancy Due Date Calculator', desc: 'Calculate your estimated due date based on last menstrual period or conception date.',
      keywords: 'due date calculator, pregnancy calculator, when is my due date, pregnancy due date, conception calculator',
      html: `<div class="field"><label class="label">First Day of Last Period</label><input type="date" id="lmp"></div>
<button class="btn" onclick="calc()">Calculate Due Date</button><div class="results-grid" id="out"></div>`,
      js: `$('lmp').value=new Date(Date.now()-90*864e5).toISOString().slice(0,10);function calc(){const lmp=new Date($('lmp').value);const due=new Date(lmp);due.setDate(due.getDate()+280);const now=new Date();const daysPreg=Math.floor((now-lmp)/864e5);const weeks=Math.floor(daysPreg/7);const days=daysPreg%7;const daysLeft=Math.max(0,Math.floor((due-now)/864e5));const trimester=weeks<13?'1st':weeks<27?'2nd':'3rd';
$('out').innerHTML='<div class="stat"><div class="val" style="color:#ec4899">'+due.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})+'</div><div class="lbl">Estimated Due Date</div></div><div class="stat"><div class="val">'+weeks+'w '+days+'d</div><div class="lbl">Current Week</div></div><div class="stat"><div class="val">'+daysLeft+'</div><div class="lbl">Days Remaining</div></div><div class="stat"><div class="val">'+trimester+'</div><div class="lbl">Trimester</div></div>'}`
    },
    { slug: 'ideal-weight', title: 'Ideal Weight Calculator', desc: 'Calculate your ideal body weight using multiple medical formulas — Devine, Robinson, Miller, Hamwi.',
      keywords: 'ideal weight calculator, healthy weight, ideal body weight, how much should I weigh, target weight calculator',
      html: `<div class="row"><div class="field"><label class="label">Gender</label><select id="gender"><option value="male">Male</option><option value="female">Female</option></select></div><div class="field"><label class="label">Height</label><div class="row"><input type="number" id="feet" value="5" placeholder="ft"><input type="number" id="inches" value="10" placeholder="in"></div></div></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const g=$('gender').value;const h=+$('feet').value*12+ +$('inches').value;const over=h-60;
const devine=g==='male'?50+2.3*over:45.5+2.3*over;const robinson=g==='male'?52+1.9*over:49+1.7*over;const miller=g==='male'?56.2+1.41*over:53.1+1.36*over;const hamwi=g==='male'?48+2.7*over:45.5+2.2*over;
const avg=(devine+robinson+miller+hamwi)/4;const toKg=2.205;
$('out').innerHTML='<div class="stat"><div class="val" style="color:var(--a)">'+fmt(avg*toKg,0)+' lbs</div><div class="lbl">Average Ideal Weight</div></div><div class="stat"><div class="val">'+fmt(devine*toKg,0)+' lbs</div><div class="lbl">Devine Formula</div></div><div class="stat"><div class="val">'+fmt(robinson*toKg,0)+' lbs</div><div class="lbl">Robinson Formula</div></div><div class="stat"><div class="val">'+fmt(miller*toKg,0)+' lbs</div><div class="lbl">Miller Formula</div></div>'}`
    },
];

// ============================================================
// CATEGORY 4: Financial Calculators (HIGH CPC)
// ============================================================
const finCalcs = [
    { slug: 'paycheck-calculator', title: 'Paycheck Calculator', desc: 'Calculate your net take-home pay after taxes and deductions from your gross salary.',
      keywords: 'paycheck calculator, take home pay calculator, net pay calculator, salary after taxes, paycheck estimator',
      html: `<div class="row"><div class="field"><label class="label">Gross Pay (per period)</label><input type="number" id="gross" value="3500"></div><div class="field"><label class="label">Pay Period</label><select id="period"><option value="26">Bi-Weekly</option><option value="24">Semi-Monthly</option><option value="52">Weekly</option><option value="12">Monthly</option></select></div></div>
<div class="row"><div class="field"><label class="label">Federal Tax Bracket (%)</label><input type="number" id="fed" value="22"></div><div class="field"><label class="label">State Tax (%)</label><input type="number" id="state" value="5"></div></div>
<div class="row"><div class="field"><label class="label">401(k) Contribution (%)</label><input type="number" id="k401" value="6"></div><div class="field"><label class="label">Other Deductions ($)</label><input type="number" id="other" value="150"></div></div>
<button class="btn" onclick="calc()">Calculate Paycheck</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const g=+$('gross').value;const per=+$('period').value;const fed=g*$('fed').value/100;const state=g*$('state').value/100;const ss=g*0.062;const med=g*0.0145;const k=g*$('k401').value/100;const oth=+$('other').value;const net=g-fed-state-ss-med-k-oth;const annual=net*per;
$('out').innerHTML='<div class="stat"><div class="val" style="color:#22c55e">$'+fmt(net,2)+'</div><div class="lbl">Net Pay</div></div><div class="stat"><div class="val">$'+fmt(fed,2)+'</div><div class="lbl">Federal Tax</div></div><div class="stat"><div class="val">$'+fmt(state,2)+'</div><div class="lbl">State Tax</div></div><div class="stat"><div class="val">$'+fmt(ss+med,2)+'</div><div class="lbl">FICA</div></div><div class="stat"><div class="val">$'+fmt(k,2)+'</div><div class="lbl">401(k)</div></div><div class="stat"><div class="val" style="color:#22c55e">$'+fmt(annual,0)+'</div><div class="lbl">Annual Net</div></div>'}`
    },
    { slug: 'rent-vs-buy', title: 'Rent vs Buy Calculator', desc: 'Should you rent or buy? Compare the total costs of renting versus buying a home over time.',
      keywords: 'rent vs buy calculator, should I rent or buy, renting vs buying, home buying calculator, rent or buy comparison',
      html: `<div class="row"><div class="field"><label class="label">Monthly Rent ($)</label><input type="number" id="rent" value="2000"></div><div class="field"><label class="label">Annual Rent Increase (%)</label><input type="number" id="rentInc" value="3"></div></div>
<div class="row"><div class="field"><label class="label">Home Price ($)</label><input type="number" id="price" value="400000"></div><div class="field"><label class="label">Down Payment (%)</label><input type="number" id="down" value="20"></div></div>
<div class="row"><div class="field"><label class="label">Mortgage Rate (%)</label><input type="number" id="rate" value="6.5" step="0.1"></div><div class="field"><label class="label">Years to Compare</label><input type="number" id="years" value="10"></div></div>
<button class="btn" onclick="calc()">Compare</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const rent=+$('rent').value,ri=+$('rentInc').value/100,price=+$('price').value,dp=+$('down').value/100,rate=+$('rate').value/100/12,yrs=+$('years').value;
const loan=price*(1-dp);const n=30*12;const mp=loan*(rate*Math.pow(1+rate,n))/(Math.pow(1+rate,n)-1);
let totalRent=0,r=rent;for(let y=0;y<yrs;y++){totalRent+=r*12;r*=(1+ri)}
const totalBuy=dp*price+mp*yrs*12+price*0.015*yrs;const equity=price*Math.pow(1.03,yrs)-loan*Math.pow(1+rate,yrs*12)/(Math.pow(1+rate,n)-1)*(Math.pow(1+rate,n)-Math.pow(1+rate,yrs*12));
const winner=totalRent>totalBuy?'Buy':'Rent';
$('out').innerHTML='<div class="stat"><div class="val" style="color:'+(winner==='Buy'?'#22c55e':'#ef4444')+'">'+winner+' Wins</div><div class="lbl">Recommendation</div></div><div class="stat"><div class="val">$'+fmt(totalRent,0)+'</div><div class="lbl">Total Rent Cost</div></div><div class="stat"><div class="val">$'+fmt(totalBuy,0)+'</div><div class="lbl">Total Buy Cost</div></div><div class="stat"><div class="val">$'+fmt(mp,0)+'/mo</div><div class="lbl">Mortgage Payment</div></div>'}`
    },
    { slug: 'hourly-to-salary', title: 'Hourly to Salary Calculator', desc: 'Convert hourly wage to annual salary and vice versa. See weekly, monthly, and yearly breakdowns.',
      keywords: 'hourly to salary, salary to hourly, wage calculator, annual salary calculator, hourly rate calculator',
      html: `<div class="row"><div class="field"><label class="label">Hourly Rate ($)</label><input type="number" id="hourly" value="25" step="0.25"></div><div class="field"><label class="label">Hours Per Week</label><input type="number" id="hours" value="40"></div></div>
<div class="field"><label class="label">Weeks Per Year (with vacation)</label><input type="number" id="weeks" value="50"></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const h=+$('hourly').value,hrs=+$('hours').value,wks=+$('weeks').value;const annual=h*hrs*wks;
$('out').innerHTML='<div class="stat"><div class="val" style="color:var(--a)">$'+fmt(annual,0)+'</div><div class="lbl">Annual Salary</div></div><div class="stat"><div class="val">$'+fmt(annual/12,0)+'</div><div class="lbl">Monthly</div></div><div class="stat"><div class="val">$'+fmt(h*hrs,0)+'</div><div class="lbl">Weekly</div></div><div class="stat"><div class="val">$'+fmt(h*hrs*2,0)+'</div><div class="lbl">Bi-Weekly</div></div><div class="stat"><div class="val">$'+fmt(h*hrs/5,2)+'</div><div class="lbl">Daily</div></div><div class="stat"><div class="val">$'+fmt(annual/2080,2)+'</div><div class="lbl">Hourly</div></div>'}`
    },
    { slug: 'sales-tax-calculator', title: 'Sales Tax Calculator', desc: 'Calculate sales tax for any purchase. Enter amount and tax rate to see the total with tax.',
      keywords: 'sales tax calculator, tax calculator, how much is sales tax, calculate tax, total with tax',
      html: `<div class="row"><div class="field"><label class="label">Purchase Amount ($)</label><input type="number" id="amount" value="99.99" step="0.01"></div><div class="field"><label class="label">Tax Rate (%)</label><input type="number" id="rate" value="8.25" step="0.01"></div></div>
<button class="btn" onclick="calc()">Calculate Tax</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const a=+$('amount').value,r=+$('rate').value/100;const tax=a*r;
$('out').innerHTML='<div class="stat"><div class="val" style="color:var(--a)">$'+fmt(a+tax,2)+'</div><div class="lbl">Total with Tax</div></div><div class="stat"><div class="val">$'+fmt(tax,2)+'</div><div class="lbl">Tax Amount</div></div><div class="stat"><div class="val">$'+fmt(a,2)+'</div><div class="lbl">Pre-Tax Amount</div></div>'}`
    },
    { slug: 'discount-calculator', title: 'Discount Calculator', desc: 'Calculate sale prices and savings. Enter original price and discount percentage to see the final price.',
      keywords: 'discount calculator, sale price calculator, percentage off calculator, savings calculator, price after discount',
      html: `<div class="row"><div class="field"><label class="label">Original Price ($)</label><input type="number" id="price" value="149.99" step="0.01"></div><div class="field"><label class="label">Discount (%)</label><input type="number" id="disc" value="25"></div></div>
<div class="field"><label class="label">Sales Tax (%)</label><input type="number" id="tax" value="8.25" step="0.01"></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const p=+$('price').value,d=+$('disc').value/100,t=+$('tax').value/100;const sale=p*(1-d);const tax=sale*t;
$('out').innerHTML='<div class="stat"><div class="val" style="color:#22c55e">$'+fmt(sale,2)+'</div><div class="lbl">Sale Price</div></div><div class="stat"><div class="val" style="color:#ef4444">$'+fmt(p-sale,2)+'</div><div class="lbl">You Save</div></div><div class="stat"><div class="val">$'+fmt(sale+tax,2)+'</div><div class="lbl">Total with Tax</div></div>'}`
    },
];

// ============================================================
// CATEGORY 5: Random / Fun / Utility (viral potential)
// ============================================================
const utilCalcs = [
    { slug: 'random-number-generator', title: 'Random Number Generator', desc: 'Generate random numbers, pick random items from a list, simulate dice rolls, and coin flips.',
      keywords: 'random number generator, RNG, random picker, dice roller, coin flip, random number',
      html: `<div class="row"><div class="field"><label class="label">Minimum</label><input type="number" id="min" value="1"></div><div class="field"><label class="label">Maximum</label><input type="number" id="max" value="100"></div></div>
<div class="field"><label class="label">How many numbers?</label><input type="number" id="count" value="1"></div>
<button class="btn" onclick="calc()">Generate</button>
<div class="result" id="out"></div>
<div class="results-grid" style="margin-top:1rem"><div class="stat" onclick="flip()" style="cursor:pointer"><div class="val" id="coin">🪙</div><div class="lbl">Flip Coin</div></div><div class="stat" onclick="dice()" style="cursor:pointer"><div class="val" id="die">🎲</div><div class="lbl">Roll Dice</div></div></div>`,
      js: `function calc(){const min=+$('min').value,max=+$('max').value,c=+$('count').value;const nums=[];for(let i=0;i<Math.min(c,100);i++)nums.push(Math.floor(Math.random()*(max-min+1))+min);$('out').innerHTML='<div class="val">'+nums.join(', ')+'</div><div class="lbl">Random Number'+(c>1?'s':'')+'</div>'}
function flip(){$('coin').textContent=Math.random()<0.5?'Heads ⬆️':'Tails ⬇️'}
function dice(){$('die').textContent=['⚀','⚁','⚂','⚃','⚄','⚅'][Math.floor(Math.random()*6)]}`
    },
    { slug: 'tip-calculator', title: 'Tip Calculator', desc: 'Calculate restaurant tips instantly. Split the bill between friends with custom tip percentages.',
      keywords: 'tip calculator, restaurant tip, bill splitter, how much to tip, gratuity calculator, split bill',
      html: `<div class="row"><div class="field"><label class="label">Bill Amount ($)</label><input type="number" id="bill" value="85.50" step="0.01"></div><div class="field"><label class="label">Tip (%)</label><input type="number" id="tip" value="20"></div></div>
<div class="field"><label class="label">Split Between</label><input type="number" id="split" value="2" min="1"></div>
<div style="display:flex;gap:.5rem;margin-bottom:1rem"><button class="btn" style="background:var(--s2);border:1px solid var(--b)" onclick="$('tip').value=15;calc()">15%</button><button class="btn" style="background:var(--s2);border:1px solid var(--b)" onclick="$('tip').value=18;calc()">18%</button><button class="btn" onclick="$('tip').value=20;calc()">20%</button><button class="btn" style="background:var(--s2);border:1px solid var(--b)" onclick="$('tip').value=25;calc()">25%</button></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const b=+$('bill').value,t=+$('tip').value/100,s=+$('split').value||1;const tip=b*t;
$('out').innerHTML='<div class="stat"><div class="val">$'+fmt(tip,2)+'</div><div class="lbl">Tip Amount</div></div><div class="stat"><div class="val" style="color:var(--a)">$'+fmt(b+tip,2)+'</div><div class="lbl">Total</div></div><div class="stat"><div class="val">$'+fmt((b+tip)/s,2)+'</div><div class="lbl">Per Person</div></div><div class="stat"><div class="val">$'+fmt(tip/s,2)+'</div><div class="lbl">Tip Per Person</div></div>'}`
    },
    { slug: 'gas-mileage-calculator', title: 'Gas Mileage Calculator (MPG)', desc: 'Calculate your car\'s fuel efficiency in MPG. Track gas costs per mile and estimate trip fuel costs.',
      keywords: 'gas mileage calculator, MPG calculator, fuel economy, miles per gallon, fuel cost calculator, trip gas cost',
      html: `<div class="row"><div class="field"><label class="label">Distance (miles)</label><input type="number" id="miles" value="300"></div><div class="field"><label class="label">Gallons Used</label><input type="number" id="gallons" value="10" step="0.1"></div></div>
<div class="field"><label class="label">Gas Price ($/gallon)</label><input type="number" id="price" value="3.50" step="0.01"></div>
<button class="btn" onclick="calc()">Calculate</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const m=+$('miles').value,g=+$('gallons').value,p=+$('price').value;const mpg=m/g;const cpg=p/mpg;const annual=12000/mpg*p;
$('out').innerHTML='<div class="stat"><div class="val" style="color:var(--a)">'+fmt(mpg,1)+'</div><div class="lbl">Miles Per Gallon</div></div><div class="stat"><div class="val">$'+fmt(cpg,2)+'</div><div class="lbl">Cost Per Mile</div></div><div class="stat"><div class="val">$'+fmt(g*p,2)+'</div><div class="lbl">Trip Fuel Cost</div></div><div class="stat"><div class="val">$'+fmt(annual,0)+'</div><div class="lbl">Est. Annual Fuel</div></div>'}`
    },
    { slug: 'electricity-cost', title: 'Electricity Cost Calculator', desc: 'Calculate the electricity cost of running any appliance. See daily, monthly, and annual energy costs.',
      keywords: 'electricity cost calculator, energy cost, power consumption calculator, electric bill calculator, kWh calculator, appliance cost',
      html: `<div class="row"><div class="field"><label class="label">Wattage (watts)</label><input type="number" id="watts" value="1000"></div><div class="field"><label class="label">Hours Used Per Day</label><input type="number" id="hours" value="8" step="0.5"></div></div>
<div class="field"><label class="label">Electricity Rate ($/kWh)</label><input type="number" id="rate" value="0.15" step="0.01"></div>
<button class="btn" onclick="calc()">Calculate Cost</button><div class="results-grid" id="out"></div>`,
      js: `function calc(){const w=+$('watts').value,h=+$('hours').value,r=+$('rate').value;const daily=w/1000*h*r;
$('out').innerHTML='<div class="stat"><div class="val">$'+fmt(daily,2)+'</div><div class="lbl">Daily Cost</div></div><div class="stat"><div class="val">$'+fmt(daily*7,2)+'</div><div class="lbl">Weekly Cost</div></div><div class="stat"><div class="val" style="color:var(--a)">$'+fmt(daily*30,2)+'</div><div class="lbl">Monthly Cost</div></div><div class="stat"><div class="val">$'+fmt(daily*365,2)+'</div><div class="lbl">Annual Cost</div></div><div class="stat"><div class="val">'+fmt(w/1000*h,1)+' kWh</div><div class="lbl">Daily Usage</div></div><div class="stat"><div class="val">'+fmt(w/1000*h*365,0)+' kWh</div><div class="lbl">Annual Usage</div></div>'}`
    },
];

// Combine all
const allCalcs = [...dateCalcs, ...mathCalcs, ...healthCalcs, ...finCalcs, ...utilCalcs];

console.log(`Generating ${allCalcs.length} calculator pages...`);
let sitemapEntries = [];

allCalcs.forEach(c => {
    const html = calcPage(c.slug, c.title, c.desc, c.keywords, c.html, c.js);
    fs.writeFileSync(`${__dirname}/calc/${c.slug}.html`, html);
    sitemapEntries.push(`    <url><loc>${BASE}/calc/${c.slug}.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
    console.log(`  ✅ ${c.slug}`);
});

// Update sitemap
const existingSitemap = fs.readFileSync(`${__dirname}/sitemap.xml`, 'utf8');
const newSitemap = existingSitemap.replace('</urlset>', sitemapEntries.join('\n') + '\n</urlset>');
fs.writeFileSync(`${__dirname}/sitemap.xml`, newSitemap);

console.log(`\n🎉 Generated ${allCalcs.length} calculator pages in /calc/`);
console.log(`📊 Sitemap updated with ${sitemapEntries.length} new URLs`);
