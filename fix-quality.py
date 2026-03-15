#!/usr/bin/env python3
"""Fix quality issues: add gold CSS, page-title class, and footer to pages missing them."""

import re
from pathlib import Path

# Pages to fix
PAGES = [
    'calc/natural-gas-cost-calculator.html',
    'calc/salary-comparison-calculator.html',
    'calc/bitcoin-to-usd-calculator.html'
]

# Gold CSS (extracted from bmi-calculator.html)
GOLD_CSS = '''<style>
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

/* === NAV === */
.nav{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}
.logo{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}.logo span{color:var(--accent)}
.nav-links{display:flex;gap:.15rem}
.nav-links a{font-size:.8rem;color:var(--text-3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}
.nav-links a:hover{color:var(--text);background:rgba(0,0,0,.04)}

/* === LAYOUT === */
.page{max-width:var(--mw);margin:0 auto;padding:0 2rem}

.breadcrumb{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text-3)}
.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--accent)}
.breadcrumb .sep{margin:0 .35rem;opacity:.4}

.page-title{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}
.page-desc{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:600px}

/* === CALCULATOR CARD === */
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.card h2{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}

.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.form-group{display:flex;flex-direction:column;gap:.3rem}
.form-group label{font-size:.78rem;font-weight:600;color:var(--text-2);letter-spacing:.02em;text-transform:uppercase}
.form-group input,.form-group select{padding:.7rem .85rem;font-size:.95rem;font-family:var(--font);background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);color:var(--text);outline:none;transition:all .2s}
.form-group input:focus,.form-group select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1);background:var(--white)}

.toggle-row{display:flex;gap:.5rem;margin-bottom:1.25rem}
.toggle-btn{padding:.5rem 1.25rem;font-size:.8rem;font-weight:600;font-family:var(--font);border:1px solid var(--border);border-radius:100px;background:var(--white);color:var(--text-3);cursor:pointer;transition:all .2s}
.toggle-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}

.btn{display:inline-flex;align-items:center;justify-content:center;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;transition:all .2s;margin-top:.5rem}
.btn:hover{background:var(--accent-hover);box-shadow:0 4px 12px rgba(0,113,227,.3)}

/* === RESULTS === */
.result-area{display:none;margin-top:1.5rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

.bmi-big{font-size:3.5rem;font-weight:800;letter-spacing:-.04em;line-height:1}
.bmi-label{font-size:1.1rem;font-weight:600;margin-top:.25rem}
.bmi-advice{font-size:.875rem;color:var(--text-2);margin-top:.75rem;line-height:1.6}

.gauge{margin:1.5rem 0;position:relative}
.gauge-bar{display:flex;height:10px;border-radius:100px;overflow:hidden;gap:2px}
.gauge-seg{height:100%;border-radius:100px}
.gauge-marker{position:absolute;top:-4px;width:3px;height:18px;background:var(--text);border-radius:2px;transform:translateX(-50%);transition:left .4s ease;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.gauge-labels{display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-3);margin-top:.4rem;padding:0 .1rem}

.stat-row{display:flex;justify-content:space-between;align-items:center;padding:.7rem 0;border-bottom:1px solid var(--border)}
.stat-row:last-child{border-bottom:none}
.stat-label{font-size:.85rem;color:var(--text-2)}
.stat-value{font-size:.95rem;font-weight:700}

/* === AD === */
.ad-slot{margin:1.5rem 0}

/* === INFO SECTIONS === */
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;margin-bottom:1.25rem;box-shadow:var(--shadow)}
.info-card h3{font-size:1rem;font-weight:700;letter-spacing:-.015em;margin-bottom:1rem}

table{width:100%;border-collapse:separate;border-spacing:0;font-size:.875rem}
th{background:var(--bg);font-weight:600;text-align:left;padding:.6rem .85rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3)}
th:first-child{border-radius:var(--r-xs) 0 0 var(--r-xs)}
th:last-child{border-radius:0 var(--r-xs) var(--r-xs) 0}
td{padding:.6rem .85rem;border-bottom:1px solid var(--border);color:var(--text-2)}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:.5rem;vertical-align:middle}

/* FAQ */
.faq{border-top:1px solid var(--border);padding:.85rem 0}
.faq:last-child{border-bottom:none}
.faq-q{font-size:.9rem;font-weight:600;margin-bottom:.35rem}
.faq-a{font-size:.85rem;color:var(--text-2);line-height:1.65}

/* Related */
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem}
.related-link{display:block;padding:.75rem 1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);font-size:.8rem;color:var(--text-2);font-weight:500;transition:all .2s}
.related-link:hover{border-color:var(--accent);color:var(--accent)}

/* === FOOTER === */
.footer{border-top:1px solid var(--border);margin-top:3rem;padding:2.5rem 2rem 1.5rem;background:var(--white)}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem}
.footer h5{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);margin-bottom:.65rem}
.footer p{font-size:.8rem;color:var(--text-2);line-height:1.6}
.footer a{display:block;font-size:.8rem;color:var(--text-3);padding:.2rem 0;transition:color .15s}
.footer a:hover{color:var(--text)}
.footer-bottom{max-width:var(--mw);margin:0 auto;padding-top:1.5rem;border-top:1px solid var(--border);text-align:center}
.footer-bottom p{font-size:.72rem;color:var(--text-3)}

/* === RESPONSIVE === */
@media(max-width:768px){
  .nav-links{display:none}
  .page{padding:0 1.25rem}
  .page-title{font-size:1.75rem}
  .form-row{grid-template-columns:1fr}
  .related-grid{grid-template-columns:1fr 1fr}
  .footer-inner{grid-template-columns:1fr 1fr}
}
@media(max-width:480px){
  .related-grid{grid-template-columns:1fr}
  .footer-inner{grid-template-columns:1fr}
}
</style>'''

# Footer HTML
FOOTER = '''
<!-- Footer -->
<div class="calc-disclaimer" style="margin:1.5rem 0;padding:1rem 1.25rem;background:#fff8e1;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;font-size:.85rem;line-height:1.6;color:#92400e"><strong>⚠️ Disclaimer:</strong> This calculator is for informational and educational purposes only. Results are estimates and should not be considered financial, legal, or professional advice. Always consult with qualified professionals for important decisions. CalcLeap assumes no liability for any outcomes based on these calculations.</div>
<footer class="footer" role="contentinfo">
  <div class="footer-inner">
    <div>
      <a class="logo" href="../index.html">Calc<span>Leap</span></a>
      <p style="margin-top:.4rem">Fast, beautiful, private calculators. Free forever.</p>
    </div>
    <div>
      <h4>Popular</h4>
      <a href="../bmi-calculator.html">BMI Calculator</a>
      <a href="../calc/mortgage-payment.html">Mortgage</a>
      <a href="../income-tax-calculator.html">Income Tax</a>
      <a href="../calc/compound-interest.html">Compound Interest</a>
    </div>
    <div>
      <h4>Categories</h4>
      <a href="../index.html#finance">Financial</a>
      <a href="../index.html#insurance">Insurance</a>
      <a href="../index.html#health">Health</a>
      <a href="../index.html#converters">Converters</a>
    </div>
    <div>
      <h4>Company</h4>
      <a href="../about.html">About</a>
      <a href="../privacy.html">Privacy</a>
      <a href="../terms.html">Terms</a>
      <a href="../contact.html">Contact</a>
      <a href="../blog/index.html">Blog</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 CalcLeap. For informational purposes only.</p>
  </div>
</footer>
'''

def fix_page(filepath):
    """Fix a single page: add CSS, fix H1 class, add footer."""
    print(f"Fixing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add gold CSS if missing (insert before </head>)
    if '/* === CalcLeap Apple Design System ===' not in content:
        content = content.replace('</head>', f'{GOLD_CSS}\n</head>')
        print(f"  ✓ Added gold CSS")
    
    # 2. Fix H1 to include class="page-title"
    content = re.sub(r'<h1>([^<]+)</h1>', r'<h1 class="page-title">\1</h1>', content)
    print(f"  ✓ Fixed H1 class")
    
    # 3. Add footer before cookie consent (if not present)
    if '<footer class="footer"' not in content:
        # Find the cookie consent div
        cookie_pattern = r'<div id="clCookieConsent"'
        if cookie_pattern in content:
            content = re.sub(cookie_pattern, f'{FOOTER}\n<div id="clCookieConsent"', content)
            print(f"  ✓ Added footer")
        else:
            # Fallback: add before </body>
            content = content.replace('</body>', f'{FOOTER}\n</body>')
            print(f"  ✓ Added footer (fallback)")
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✅ Done: {filepath}\n")

def main():
    for page in PAGES:
        fix_page(page)
    
    print("✅ All pages fixed. Run audit.py to verify.")

if __name__ == '__main__':
    main()
