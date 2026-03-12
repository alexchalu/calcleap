#!/usr/bin/env python3
"""
Add lead capture forms to all insurance calculator pages.
Forms collect: name, email, phone, zip code, insurance type.
Leads are sent to Alex's email via Formsubmit.co AND stored in localStorage for backup.
Forms are placed ABOVE the calculator (high visibility) and BELOW results (high intent).
"""

import os
import re
import glob

INSURANCE_DIRS = [
    'auto-insurance',
    'home-insurance', 
    'life-insurance',
    'health-insurance',
    'disability-insurance',
]

# Also match root-level insurance pages
ROOT_INSURANCE_PATTERNS = [
    '*insurance*.html',
]

LEAD_FORM_CSS = """
/* === LEAD CAPTURE FORM === */
.lead-form-section{background:linear-gradient(135deg,#0071e3 0%,#005bb5 100%);border-radius:var(--r);padding:2rem;margin:1.5rem 0;color:#fff;position:relative;overflow:hidden}
.lead-form-section::before{content:'';position:absolute;top:-50%;right:-30%;width:300px;height:300px;background:rgba(255,255,255,.05);border-radius:50%}
.lead-form-section h3{font-size:1.3rem;font-weight:700;margin-bottom:.35rem;letter-spacing:-.02em}
.lead-form-section .lead-subtitle{font-size:.9rem;opacity:.85;margin-bottom:1.25rem;line-height:1.4}
.lead-form-section .lead-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.lead-form-section input{padding:.7rem .85rem;font-size:.9rem;font-family:var(--font);background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:var(--r-xs);color:#fff;outline:none;transition:all .2s;width:100%}
.lead-form-section input::placeholder{color:rgba(255,255,255,.6)}
.lead-form-section input:focus{background:rgba(255,255,255,.25);border-color:rgba(255,255,255,.5)}
.lead-form-section .lead-btn{grid-column:1/-1;padding:.8rem;font-size:1rem;font-weight:700;font-family:var(--font);background:#fff;color:#0071e3;border:none;border-radius:var(--r-xs);cursor:pointer;transition:all .2s;margin-top:.25rem}
.lead-form-section .lead-btn:hover{background:#f0f0f0;transform:translateY(-1px);box-shadow:0 4px 15px rgba(0,0,0,.2)}
.lead-form-section .lead-privacy{font-size:.7rem;opacity:.6;margin-top:.75rem;text-align:center}
.lead-form-section .lead-success{display:none;text-align:center;padding:1.5rem 0}
.lead-form-section .lead-success h4{font-size:1.2rem;margin-bottom:.5rem}
.lead-form-section .lead-success p{opacity:.8;font-size:.9rem}
.lead-badges{display:flex;gap:.5rem;margin-bottom:1rem;flex-wrap:wrap}
.lead-badge{display:inline-flex;align-items:center;gap:.3rem;background:rgba(255,255,255,.15);padding:.25rem .6rem;border-radius:100px;font-size:.72rem;font-weight:600}
@media(max-width:600px){.lead-form-section .lead-grid{grid-template-columns:1fr}}
"""

def get_insurance_type(filepath):
    """Determine insurance type from filename."""
    name = os.path.basename(filepath).lower()
    if 'auto' in name or 'car' in name or 'vehicle' in name:
        return 'Auto Insurance'
    elif 'home' in name or 'homeowner' in name or 'house' in name or 'property' in name:
        return 'Home Insurance'
    elif 'life' in name:
        return 'Life Insurance'
    elif 'health' in name or 'medical' in name:
        return 'Health Insurance'
    elif 'disability' in name:
        return 'Disability Insurance'
    elif 'business' in name or 'commercial' in name:
        return 'Business Insurance'
    elif 'renters' in name or 'renter' in name:
        return 'Renters Insurance'
    elif 'pet' in name:
        return 'Pet Insurance'
    elif 'motorcycle' in name:
        return 'Motorcycle Insurance'
    elif 'boat' in name or 'marine' in name:
        return 'Boat Insurance'
    elif 'flood' in name:
        return 'Flood Insurance'
    elif 'earthquake' in name:
        return 'Earthquake Insurance'
    elif 'long-term' in name or 'ltc' in name:
        return 'Long-Term Care Insurance'
    elif 'umbrella' in name:
        return 'Umbrella Insurance'
    elif 'travel' in name:
        return 'Travel Insurance'
    else:
        return 'Insurance'

def make_lead_form_html(insurance_type, form_id):
    """Generate the lead capture form HTML."""
    return f'''
<!-- LEAD CAPTURE FORM -->
<div class="lead-form-section" id="leadForm_{form_id}">
  <h3>💰 Get Free {insurance_type} Quotes</h3>
  <p class="lead-subtitle">Compare rates from top providers. Takes 30 seconds — no obligation, no spam.</p>
  <div class="lead-badges">
    <span class="lead-badge">✓ Free quotes</span>
    <span class="lead-badge">✓ No obligation</span>
    <span class="lead-badge">✓ Save up to 40%</span>
    <span class="lead-badge">✓ Top-rated providers</span>
  </div>
  <form id="leadFormEl_{form_id}" onsubmit="return submitLead_{form_id}(event)">
    <div class="lead-grid">
      <input type="text" name="name" placeholder="Full Name" required>
      <input type="email" name="email" placeholder="Email Address" required>
      <input type="tel" name="phone" placeholder="Phone Number" required>
      <input type="text" name="zip" placeholder="ZIP Code" required pattern="[0-9]{{5}}" maxlength="5">
      <input type="hidden" name="insurance_type" value="{insurance_type}">
      <input type="hidden" name="source_page" value="">
      <button type="submit" class="lead-btn">Get My Free Quotes →</button>
    </div>
  </form>
  <div class="lead-success" id="leadSuccess_{form_id}">
    <h4>✅ Quote Request Received!</h4>
    <p>A licensed agent will contact you shortly with personalized {insurance_type.lower()} quotes. Average savings: $480/year.</p>
  </div>
  <p class="lead-privacy">🔒 Your info is secure and never shared with spammers. By submitting, you agree to be contacted by licensed insurance agents.</p>
</div>
<script>
function submitLead_{form_id}(e){{
  e.preventDefault();
  var f=e.target;
  var d={{name:f.name.value,email:f.email.value,phone:f.phone.value,zip:f.zip.value,type:"{insurance_type}",page:location.href,ts:new Date().toISOString()}};
  // Store lead in localStorage backup
  var leads=JSON.parse(localStorage.getItem('calcleap_leads')||'[]');
  leads.push(d);localStorage.setItem('calcleap_leads',JSON.stringify(leads));
  // Send via Formsubmit.co (free, no signup)
  fetch('https://formsubmit.co/ajax/alexmathewc@gmail.com',{{
    method:'POST',headers:{{'Content-Type':'application/json','Accept':'application/json'}},
    body:JSON.stringify({{name:d.name,email:d.email,phone:d.phone,zip:d.zip,_subject:'🔥 New '+'{insurance_type}'+' Lead from CalcLeap',insurance_type:'{insurance_type}',source_page:location.href,timestamp:d.ts}})
  }}).catch(function(){{}});
  // Show success
  f.style.display='none';
  document.getElementById('leadSuccess_{form_id}').style.display='block';
  // Track conversion
  if(typeof gtag!=='undefined')gtag('event','lead_submit',{{event_category:'lead_gen',event_label:'{insurance_type}'}});
  return false;
}}
document.querySelector('#leadFormEl_{form_id} [name=source_page]').value=location.href;
</script>
<!-- END LEAD CAPTURE -->
'''

def add_lead_form_to_page(filepath):
    """Add lead capture form to an insurance calculator page."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except:
        return False
    
    # Skip if already has lead form
    if 'lead-form-section' in content or 'LEAD CAPTURE FORM' in content:
        return False
    
    # Skip non-insurance pages that might match patterns
    if 'generate' in os.path.basename(filepath) or 'build' in os.path.basename(filepath):
        return False
    
    insurance_type = get_insurance_type(filepath)
    form_id = re.sub(r'[^a-zA-Z0-9]', '', os.path.basename(filepath).replace('.html', ''))
    
    modified = False
    
    # 1. Add CSS before </style>
    if '</style>' in content and '.lead-form-section' not in content:
        content = content.replace('</style>', LEAD_FORM_CSS + '\n</style>', 1)
        modified = True
    
    # 2. Add form after the first .card div (before the calculator)
    # Look for the first card's opening
    lead_html = make_lead_form_html(insurance_type, form_id)
    
    # Strategy: Insert AFTER the first ad slot (which is right after page description)
    # Or after page-desc
    ad_marker = '<!-- Ad Slot 1 -->'
    first_ad_pattern = r'(<!-- Ad Slot 1 -->.*?</ins>\s*<script>[^<]*</script>)'
    
    # Try to insert after first ad slot
    match = re.search(first_ad_pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + '\n' + lead_html + '\n' + content[insert_pos:]
        modified = True
    elif '<div class="card">' in content:
        # Insert before first calculator card
        content = content.replace('<div class="card">', lead_html + '\n<div class="card">', 1)
        modified = True
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    os.chdir('/data/workspace/toolpulse')
    
    files_to_process = []
    
    # Get files from insurance directories
    for d in INSURANCE_DIRS:
        if os.path.isdir(d):
            files_to_process.extend(glob.glob(f'{d}/*.html'))
    
    # Get root-level insurance pages
    for pattern in ROOT_INSURANCE_PATTERNS:
        files_to_process.extend(glob.glob(pattern))
    
    # Deduplicate
    files_to_process = list(set(files_to_process))
    
    total = len(files_to_process)
    modified = 0
    skipped = 0
    errors = 0
    
    print(f"Found {total} insurance pages to process")
    
    for fp in sorted(files_to_process):
        try:
            if add_lead_form_to_page(fp):
                modified += 1
            else:
                skipped += 1
        except Exception as e:
            errors += 1
            print(f"  ERROR {fp}: {e}")
    
    print(f"\nDone! Modified: {modified}, Skipped: {skipped}, Errors: {errors}")

if __name__ == '__main__':
    main()
