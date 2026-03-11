import os, re

# Add OG image meta tags to top pages that don't have them
# Use a generic branded image URL (we'll create it)
OG_IMG = "https://calcleap.com/og-default.png"

count = 0
for root, dirs, files in os.walk('.'):
    if '.git' in root: continue
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    for f in files:
        if not f.endswith('.html'): continue
        fp = os.path.join(root, f)
        html = open(fp).read()
        if 'og:image' in html: continue
        if '</head>' not in html: continue
        
        tag = f'<meta property="og:image" content="{OG_IMG}">\n</head>'
        html = html.replace('</head>', tag, 1)
        open(fp, 'w').write(html)
        count += 1

print(f'Added OG image tags to {count} pages')
