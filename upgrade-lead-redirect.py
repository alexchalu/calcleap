#!/usr/bin/env python3
"""
Upgrade lead forms: after submission, redirect users to real insurance comparison sites.
This gives users actual value (real quotes) and positions us for affiliate revenue.

When SmartFinancial API key is available, we'll swap these redirects for direct API posting.
"""

import os
import re
import glob

# Redirect URLs by insurance type — these are the top comparison sites
REDIRECT_URLS = {
    'Auto Insurance': 'https://www.policygenius.com/auto-insurance/partner-offers/',
    'Home Insurance': 'https://www.policygenius.com/homeowners-insurance/',
    'Life Insurance': 'https://www.policygenius.com/life-insurance/',
    'Health Insurance': 'https://www.healthcare.gov/see-plans/',
    'Disability Insurance': 'https://www.policygenius.com/disability-insurance/',
    'Business Insurance': 'https://www.thimble.com/get-a-quote',
    'Renters Insurance': 'https://www.policygenius.com/renters-insurance/',
    'Pet Insurance': 'https://www.policygenius.com/pet-insurance/',
    'Motorcycle Insurance': 'https://www.policygenius.com/auto-insurance/',
    'Boat Insurance': 'https://www.policygenius.com/auto-insurance/',
    'Flood Insurance': 'https://www.policygenius.com/homeowners-insurance/',
    'Earthquake Insurance': 'https://www.policygenius.com/homeowners-insurance/',
    'Long-Term Care Insurance': 'https://www.policygenius.com/long-term-care-insurance/',
    'Umbrella Insurance': 'https://www.policygenius.com/homeowners-insurance/',
    'Travel Insurance': 'https://www.policygenius.com/travel-insurance/',
    'Insurance': 'https://www.policygenius.com/',
}

def get_insurance_type(filepath):
    name = os.path.basename(filepath).lower()
    types = {
        'auto': 'Auto Insurance', 'car': 'Auto Insurance', 'vehicle': 'Auto Insurance',
        'home': 'Home Insurance', 'homeowner': 'Home Insurance', 'house': 'Home Insurance', 'property': 'Home Insurance',
        'life': 'Life Insurance',
        'health': 'Health Insurance', 'medical': 'Health Insurance',
        'disability': 'Disability Insurance',
        'business': 'Business Insurance', 'commercial': 'Business Insurance',
        'renter': 'Renters Insurance',
        'pet': 'Pet Insurance',
        'motorcycle': 'Motorcycle Insurance',
        'boat': 'Boat Insurance', 'marine': 'Boat Insurance',
        'flood': 'Flood Insurance',
        'earthquake': 'Earthquake Insurance',
        'long-term': 'Long-Term Care Insurance', 'ltc': 'Long-Term Care Insurance',
        'umbrella': 'Umbrella Insurance',
        'travel': 'Travel Insurance',
    }
    for key, val in types.items():
        if key in name:
            return val
    return 'Insurance'

def process_page(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except:
        return False
    
    if 'LEAD WIZARD V2' not in content:
        return False
    
    insurance_type = get_insurance_type(filepath)
    redirect_url = REDIRECT_URLS.get(insurance_type, 'https://www.policygenius.com/')
    form_id = re.sub(r'[^a-zA-Z0-9]', '', os.path.basename(filepath).replace('.html', ''))
    
    # Add redirect after the show(4) line in the submit function
    # Find the submit function and add redirect with delay
    old_show4 = 'show(4);\n  if(typeof gtag'
    new_show4 = f'show(4);\n  setTimeout(function(){{window.open("{redirect_url}","_blank")}},2000);\n  if(typeof gtag'
    
    if old_show4 in content and redirect_url not in content:
        content = content.replace(old_show4, new_show4)
        
        # Also update the success message to tell users about the redirect
        old_success = f'A licensed {insurance_type.lower()} agent will reach out shortly with personalized rates from top-rated carriers.'
        new_success = "We are opening a comparison tool where you can see real quotes from top carriers. A licensed agent may also follow up with personalized rates."
        content = content.replace(old_success, new_success)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    os.chdir('/data/workspace/toolpulse')
    
    files = []
    for d in ['auto-insurance', 'home-insurance', 'life-insurance', 'health-insurance', 'disability-insurance']:
        if os.path.isdir(d):
            files.extend(glob.glob(f'{d}/*.html'))
    files.extend(glob.glob('*insurance*.html'))
    files = list(set(f for f in files if not ('generate' in f or 'build' in f)))
    
    total = len(files)
    modified = 0
    
    print(f"Upgrading {total} pages with quote redirects...")
    
    for fp in sorted(files):
        try:
            if process_page(fp):
                modified += 1
        except Exception as e:
            print(f"  ERROR {fp}: {e}")
    
    print(f"\nDone! Upgraded: {modified}/{total}")

if __name__ == '__main__':
    main()
