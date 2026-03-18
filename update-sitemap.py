#!/usr/bin/env python3
import os, glob
from datetime import datetime

urls = []
base = "https://calcleap.com"

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f).replace('./', '')
            if path not in ['404.html', 'google*.html', 'BingSiteAuth.xml']:
                urls.append(f"{base}/{path}")

urls.sort()

with open('sitemap.xml', 'w') as out:
    out.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    out.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for url in urls:
        out.write(f'  <url><loc>{url}</loc><lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod></url>\n')
    out.write('</urlset>\n')

print(f"Sitemap updated with {len(urls)} URLs")
