#!/usr/bin/env python3
"""Comprehensive quality audit of all HTML pages on calcleap.com"""
import os, re, glob, json

results = {
    'total': 0,
    'pass': 0,
    'dup_h1': [],
    'excess_ads': [],
    'no_page_title': [],
    'no_gold_css': [],
    'no_footer': [],
    'no_js': [],  # calculator pages with no JS
    'broken_links': [],
    'no_comprehensive_css': [],
}

SKIP = {'index.html', 'BingSiteAuth.xml', 'sitemap.xml', 'robots.txt', 'ads.txt', 
        'a1b2c3d4e5f6g7h8.txt', 'CNAME', 'README.md'}

# Collect all HTML files
all_files = set()
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            all_files.add(path)

# Pages that SHOULD have calculators (not blog, not index-like)
calc_patterns = ['calculator', 'calc-', 'convert-', '-tax', 'mortgage', 'insurance', 'bmi-', 'bac-']

for fpath in sorted(all_files):
    basename = os.path.basename(fpath)
    if basename in SKIP or basename.startswith('google'):
        continue
    
    results['total'] += 1
    issues = []
    
    try:
        html = open(fpath).read()
    except:
        continue
    
    # 1. Duplicate H1
    h1_count = len(re.findall(r'<h1', html, re.I))
    if h1_count > 1:
        results['dup_h1'].append(fpath)
        issues.append(f'H1:{h1_count}')
    
    # 2. Excess ads (count actual <ins> tags, not text mentions)
    ad_count = len(re.findall(r'<ins class="adsbygoogle"', html))
    if ad_count > 3:
        results['excess_ads'].append(fpath)
        issues.append(f'ADS:{ad_count}')
    
    # 3. Missing page-title
    if 'page-title' not in html:
        results['no_page_title'].append(fpath)
        issues.append('NO-TITLE')
    
    # 4. Missing gold CSS
    if '#f5f5f7' not in html:
        results['no_gold_css'].append(fpath)
        issues.append('NO-GOLD')
    
    # 5. Missing footer
    if 'class="footer"' not in html:
        results['no_footer'].append(fpath)
        issues.append('NO-FOOTER')
    
    # 6. Missing comprehensive CSS (has old undefined classes)
    if 'COMPREHENSIVE COMPONENT' not in html and 'calc-card' in html:
        results['no_comprehensive_css'].append(fpath)
        issues.append('NO-COMP-CSS')
    
    # 7. Calculator pages with no JS
    is_calc = any(p in basename.lower() for p in calc_patterns)
    if is_calc:
        has_js = bool(re.search(r'function |onclick=|<script src=', html))
        if not has_js:
            results['no_js'].append(fpath)
            issues.append('NO-JS')
    
    if not issues:
        results['pass'] += 1

print("=" * 60)
print("CALCLEAP.COM — COMPREHENSIVE QUALITY AUDIT")
print("=" * 60)
print(f"\nTotal pages: {results['total']}")
print(f"✅ Passing all checks: {results['pass']}")
print(f"❌ Duplicate H1: {len(results['dup_h1'])}")
print(f"❌ Excess ads (>7): {len(results['excess_ads'])}")
print(f"❌ Missing page-title: {len(results['no_page_title'])}")
print(f"❌ Missing gold CSS: {len(results['no_gold_css'])}")
print(f"❌ Missing footer: {len(results['no_footer'])}")
print(f"❌ Missing comprehensive CSS: {len(results['no_comprehensive_css'])}")
print(f"❌ Calculator pages with no JS: {len(results['no_js'])}")

# Show sample bad files
for category in ['dup_h1', 'excess_ads', 'no_page_title', 'no_gold_css', 'no_footer', 'no_js']:
    lst = results[category]
    if lst:
        print(f"\n--- {category} (showing first 10) ---")
        for f in lst[:10]:
            print(f"  {f}")
        if len(lst) > 10:
            print(f"  ... and {len(lst) - 10} more")
