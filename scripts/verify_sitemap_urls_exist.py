#!/usr/bin/env python3
"""
verify_sitemap_urls_exist.py — sitemap ↔ repo file existence verifier.

Purpose (queue item (gggggggggggggggg), added 2026-07-28 evening log):
Prevent stale sitemap entries that 404 after a page is renamed or deleted.
sitemap.xml is a manual append-only ledger today: every new gold-standard
post appends one <url><loc>...</loc></url> entry before </urlset>. Nothing
enforces that the entries still resolve to actual files, so a rename or
delete elsewhere in the repo silently poisons Google's crawl budget with 404s.

This script parses sitemap.xml, extracts every <loc>, strips the
https://calcleap.com/ domain prefix, resolves the remaining path against
the repo root, and reports any URL whose file does not exist. Also flags
duplicate URLs (the append-only pattern can accidentally add the same URL
twice) and non-domain URLs (any <loc> that isn't https://calcleap.com/...).

Usage:
    python3 scripts/verify_sitemap_urls_exist.py
    python3 scripts/verify_sitemap_urls_exist.py --sitemap sitemap.xml

Exit codes:
    0 — every <loc> resolves to an existing repo file, no duplicates
    1 — one or more missing files, duplicates, or malformed URLs
    2 — script itself hit an unexpected error (e.g. sitemap.xml unreadable)

Scope today:
    - Reads sitemap.xml at repo root (override with --sitemap).
    - Extracts <loc>https://calcleap.com/PATH</loc> via regex — no XML parser
      dependency; the sitemap follows a strict one-URL-per-line pattern.
    - Resolves each PATH against REPO_ROOT and calls os.path.isfile.
    - Reports up to 50 missing files and any duplicate URLs.

Companion to scripts/verify_state_dropdown_labels.py and
scripts/verify_json_ld_parses.py — same scripts/ pattern, same zero-dependency
Python 3 stdlib approach, same file:line reporting.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from typing import List, Tuple


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DEFAULT_SITEMAP = os.path.join(REPO_ROOT, "sitemap.xml")
EXPECTED_DOMAIN = "https://calcleap.com/"

# Matches <loc>URL</loc> with tolerant whitespace inside the tags.
LOC_PATTERN = re.compile(r"<loc>\s*([^<]+?)\s*</loc>", re.IGNORECASE)


def parse_sitemap(path: str) -> List[Tuple[int, str]]:
    """Return list of (line_number, url) for every <loc> in the file."""
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    results: List[Tuple[int, str]] = []
    for m in LOC_PATTERN.finditer(text):
        line = text.count("\n", 0, m.start()) + 1
        results.append((line, m.group(1)))
    return results


def url_to_repo_path(url: str) -> str:
    """Strip the expected domain prefix and return the remaining path."""
    if not url.startswith(EXPECTED_DOMAIN):
        return ""
    rel = url[len(EXPECTED_DOMAIN):]
    # Directory-style URLs (ending in /) map to index.html in that directory.
    if rel.endswith("/") or rel == "":
        rel = rel + "index.html"
    return rel


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument(
        "--sitemap",
        default=DEFAULT_SITEMAP,
        help=f"Path to sitemap.xml (default: {DEFAULT_SITEMAP})",
    )
    ap.add_argument(
        "--quiet",
        action="store_true",
        help="Only print failures + one-line summary",
    )
    args = ap.parse_args()

    if not os.path.isfile(args.sitemap):
        print(f"error: sitemap not found: {args.sitemap}", file=sys.stderr)
        return 2

    entries = parse_sitemap(args.sitemap)
    if not entries:
        print(f"error: no <loc> entries found in {args.sitemap}", file=sys.stderr)
        return 2

    seen: dict = {}
    duplicates: List[Tuple[int, str, int]] = []  # (dup_line, url, first_line)
    malformed: List[Tuple[int, str]] = []
    missing: List[Tuple[int, str, str]] = []  # (line, url, resolved_path)

    for line, url in entries:
        if url in seen:
            duplicates.append((line, url, seen[url]))
            continue
        seen[url] = line
        rel = url_to_repo_path(url)
        if not rel:
            malformed.append((line, url))
            continue
        abs_path = os.path.join(REPO_ROOT, rel)
        if not os.path.isfile(abs_path):
            missing.append((line, url, rel))

    total_problems = len(missing) + len(duplicates) + len(malformed)
    sitemap_rel = os.path.relpath(args.sitemap, REPO_ROOT)

    if total_problems == 0:
        if not args.quiet:
            print(f"OK  all {len(entries)} sitemap URLs resolve to existing "
                  f"repo files ({sitemap_rel})")
        return 0

    print(f"FAIL  {total_problems} sitemap issue(s) across {len(entries)} URLs "
          f"in {sitemap_rel}:")
    if missing:
        print(f"  {len(missing)} missing file(s):")
        for line, url, rel in missing[:50]:
            print(f"    {sitemap_rel}:{line}: {url} -> {rel} (not found)")
        if len(missing) > 50:
            print(f"    ... and {len(missing) - 50} more (showing first 50)")
    if duplicates:
        print(f"  {len(duplicates)} duplicate URL(s):")
        for line, url, first_line in duplicates[:20]:
            print(f"    {sitemap_rel}:{line}: {url} (also at line {first_line})")
        if len(duplicates) > 20:
            print(f"    ... and {len(duplicates) - 20} more (showing first 20)")
    if malformed:
        print(f"  {len(malformed)} URL(s) outside expected domain "
              f"({EXPECTED_DOMAIN}):")
        for line, url in malformed[:20]:
            print(f"    {sitemap_rel}:{line}: {url}")
        if len(malformed) > 20:
            print(f"    ... and {len(malformed) - 20} more (showing first 20)")
    return 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"error: unexpected exception: {e.__class__.__name__}: {e}",
              file=sys.stderr)
        sys.exit(2)
