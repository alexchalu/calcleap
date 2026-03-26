#!/usr/bin/env python3
"""
SEO Optimization Sweep for CalcLeap.com
Implements:
1. Add missing schema markup (WebApplication + FAQ)
2. Optimize title tags for top 20 money pages
3. Add missing OG tags
4. Internal linking audit
"""
import os
import re
import json
from pathlib import Path

# Top 20 high-CPC pages for title optimization
TOP_MONEY_PAGES = [
    'mortgage-calculator.html',
    'reverse-mortgage-calculator.html',
    'mortgage-refinance-calculator.html',
    '1099-tax-calculator.html',
    '401k-withdrawal-calculator.html',
    'alabama-income-tax-calculator.html',
    'alaska-income-tax-calculator.html',
    'arizona-income-tax-calculator.html',
    'arkansas-income-tax-calculator.html',
    'california-income-tax-calculator.html',
    'colorado-income-tax-calculator.html',
    'connecticut-income-tax-calculator.html',
    'delaware-income-tax-calculator.html',
    'florida-income-tax-calculator.html',
    'georgia-income-tax-calculator.html',
    'hawaii-income-tax-calculator.html',
    'bmi-calculator.html',
    'car-insurance-calculator.html',
    'life-insurance-calculator.html',
    'health-insurance-calculator.html',
]

# Pages that need schema markup (missing structured data)
SCHEMA_PAGES = [
    'reverse-mortgage-calculator.html',
    '1099-tax-calculator.html',
    '401k-withdrawal-calculator.html',
]

def get_calculator_name_from_filename(filename):
    """Extract clean calculator name from filename"""
    name = filename.replace('-calculator.html', '').replace('-', ' ').title()
    # Special cases
    if '1099' in name:
        name = '1099 Tax'
    elif '401k' in name or '401K' in name:
        name = '401(k) Withdrawal'
    elif 'Bmi' in name:
        name = 'BMI'
    return name

def get_calculator_type(filename):
    """Determine calculator type for title"""
    if 'mortgage' in filename:
        return 'Home Loan'
    elif 'tax' in filename and 'income' in filename:
        return 'Income Tax'
    elif '1099' in filename:
        return '1099 Income'
    elif '401k' in filename:
        return 'Retirement'
    elif 'insurance' in filename:
        return 'Insurance'
    elif 'bmi' in filename:
        return 'Body Mass Index'
    else:
        return 'Financial'

def create_schema_markup(filename, title, description, url):
    """Create WebApplication schema for calculator pages"""
    schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": title.split(' - ')[0],  # Just the calculator name
        "description": description,
        "url": url,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "isPartOf": {
            "@type": "WebSite",
            "name": "CalcLeap",
            "url": "https://calcleap.com"
        }
    }
    return json.dumps(schema, indent=2)

def optimize_title_tag(filename, current_title):
    """Optimize title tag for SEO"""
    calc_name = get_calculator_name_from_filename(filename)
    calc_type = get_calculator_type(filename)
    
    # Create optimized title
    optimized = f"{calc_name} Calculator - Free {calc_type} Calculator 2026 | CalcLeap"
    
    return optimized

def add_og_tags(html, filename, title, description):
    """Add missing OG tags"""
    url = f"https://calcleap.com/{filename}"
    
    # Check what OG tags exist
    has_og_title = 'og:title' in html
    has_og_desc = 'og:description' in html
    has_og_url = 'og:url' in html
    has_og_type = 'og:type' in html
    has_og_image = 'og:image' in html
    
    og_tags = []
    
    if not has_og_title:
        og_tags.append(f'<meta property="og:title" content="{title.split(" | ")[0]}">')
    if not has_og_desc:
        og_tags.append(f'<meta property="og:description" content="{description[:200]}">')
    if not has_og_url:
        og_tags.append(f'<meta property="og:url" content="{url}">')
    if not has_og_type:
        og_tags.append(f'<meta property="og:type" content="website">')
    if not has_og_image:
        og_tags.append('<meta property="og:image" content="https://calcleap.com/og-default.png">')
    
    return og_tags

def process_file(filepath):
    """Process a single HTML file for SEO optimization"""
    filename = os.path.basename(filepath)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
    except:
        return False
    
    modified = False
    
    # Extract current title and description
    title_match = re.search(r'<title>(.*?)</title>', html)
    desc_match = re.search(r'<meta name="description" content="(.*?)">', html)
    
    if not title_match or not desc_match:
        return False
    
    current_title = title_match.group(1)
    current_desc = desc_match.group(1)
    url = f"https://calcleap.com/{filename}"
    
    # Task 1: Add missing schema markup
    if filename in SCHEMA_PAGES:
        if '<script type="application/ld+json">' not in html:
            schema = create_schema_markup(filename, current_title, current_desc, url)
            schema_tag = f'<script type="application/ld+json">\n{schema}\n</script>'
            
            # Insert after meta tags, before style or first </head>
            insert_pos = html.find('<style>')
            if insert_pos == -1:
                insert_pos = html.find('</head>')
            
            if insert_pos != -1:
                html = html[:insert_pos] + schema_tag + '\n' + html[insert_pos:]
                modified = True
                print(f"✓ Added schema to {filename}")
    
    # Task 2: Optimize title tags for top money pages
    if filename in TOP_MONEY_PAGES:
        # Check if title needs optimization (contains "Tool" or not optimized)
        if 'Tool' in current_title or '2026' not in current_title:
            optimized_title = optimize_title_tag(filename, current_title)
            html = html.replace(f'<title>{current_title}</title>', 
                              f'<title>{optimized_title}</title>')
            modified = True
            print(f"✓ Optimized title for {filename}")
            print(f"  Old: {current_title}")
            print(f"  New: {optimized_title}")
    
    # Task 3: Add missing OG tags
    og_count = html.count('og:')
    if og_count < 5:  # Should have at least 5 OG tags
        og_tags = add_og_tags(html, filename, current_title, current_desc)
        if og_tags:
            # Insert after existing OG tags or after canonical
            insert_marker = '<meta property="og:url"'
            if insert_marker not in html:
                insert_marker = 'rel="canonical"'
            
            insert_pos = html.find(insert_marker)
            if insert_pos != -1:
                # Find end of line
                line_end = html.find('>', insert_pos) + 1
                insert_str = '\n' + '\n'.join(og_tags)
                html = html[:line_end] + insert_str + html[line_end:]
                modified = True
                print(f"✓ Added {len(og_tags)} OG tags to {filename}")
    
    # Write back if modified
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    
    return False

def audit_homepage_links():
    """Check that homepage links to all high-value pages"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            homepage = f.read()
    except:
        print("❌ Could not read index.html")
        return []
    
    orphaned = []
    for page in TOP_MONEY_PAGES:
        if page not in homepage and f'/{page}' not in homepage:
            orphaned.append(page)
    
    return orphaned

def main():
    print("=" * 70)
    print("CALCLEAP SEO OPTIMIZATION SWEEP")
    print("=" * 70)
    
    # Process all HTML files
    total_modified = 0
    
    print("\n🔍 Processing HTML files...")
    for root, dirs, files in os.walk('.'):
        # Skip .git and certain dirs
        if '.git' in root:
            continue
        
        for filename in files:
            if filename.endswith('.html') and filename not in ['index.html', 'api-docs.html', 'embed.html']:
                filepath = os.path.join(root, filename)
                if process_file(filepath):
                    total_modified += 1
    
    print(f"\n✅ Modified {total_modified} files")
    
    # Task 5: Internal linking audit
    print("\n🔗 Auditing homepage links...")
    orphaned = audit_homepage_links()
    if orphaned:
        print(f"⚠️  Found {len(orphaned)} high-value pages not linked from homepage:")
        for page in orphaned[:10]:
            print(f"   - {page}")
    else:
        print("✅ All high-value pages are linked from homepage")
    
    print("\n" + "=" * 70)
    print("SEO SWEEP COMPLETE")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Run: python3 audit.py")
    print("2. Review changes: git diff")
    print("3. Test 3-5 pages in browser")
    print("4. Submit to IndexNow")
    print("5. Commit and push")

if __name__ == '__main__':
    main()
