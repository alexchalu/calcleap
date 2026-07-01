#!/usr/bin/env python3
"""Inject a GA4 tag (Consent Mode v2) into every HTML page that lacks one.

Usage: python inject-ga4.py G-XXXXXXXXXX

- Idempotent: skips files that already contain the measurement ID.
- Consent Mode v2: analytics/ad storage denied by default in EEA/UK/CH,
  granted elsewhere. The cookie banner's Accept handler can later call
  gtag('consent','update',...) for EEA visitors (TIER 0 item M6).
- Run from repo root. Commits are your job afterwards.
"""
import re, sys
from pathlib import Path

if len(sys.argv) != 2 or not re.fullmatch(r"G-[A-Z0-9]{6,14}", sys.argv[1]):
    sys.exit("usage: python inject-ga4.py G-XXXXXXXXXX")

GID = sys.argv[1]
ROOT = Path(__file__).resolve().parent

EEA = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
       "IS","IT","LI","LV","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI",
       "ES","SE","GB","CH"]

SNIPPET = f"""<!-- GA4 (Consent Mode v2) -->
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}
gtag('consent','default',{{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','region':{EEA!r}}});
gtag('consent','default',{{'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'}});
gtag('js',new Date());gtag('config','{GID}');</script>
<script async src="https://www.googletagmanager.com/gtag/js?id={GID}"></script>
"""

injected = skipped = 0
for f in ROOT.rglob("*.html"):
    if ".git" in f.parts:
        continue
    text = f.read_text(encoding="utf-8")
    if GID in text or "googletagmanager.com/gtag/js" in text:
        skipped += 1
        continue
    if "</head>" not in text:
        skipped += 1
        continue
    text = text.replace("</head>", SNIPPET + "</head>", 1)
    f.write_text(text, encoding="utf-8")
    injected += 1

print(f"GA4 {GID}: injected into {injected} pages, skipped {skipped}")
