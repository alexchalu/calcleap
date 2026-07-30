#!/usr/bin/env python3
"""
verify_meta_tags_present.py — minimum-viable-SEO meta-tag presence verifier.

Purpose (queue item (pppppppppppppppp), added 2026-07-29 evening log):
Prevent silently shipping a page that is missing a fundamental head tag.
Every user-facing HTML page on the site must have all four of:

    <title>...</title>
    <meta name="description" content="...">
    <meta name="viewport" content="...">
    <link rel="canonical" href="...">

Missing any one of these is a measurable SEO regression: no <title> means
Google fabricates one; no description means Google fabricates a snippet; no
viewport means the mobile-friendly signal disappears; no canonical means
Google decides duplicate-content policy for us.

Usage:
    python3 scripts/verify_meta_tags_present.py               # scan whole repo
    python3 scripts/verify_meta_tags_present.py --paths a.html b.html
    python3 scripts/verify_meta_tags_present.py --quiet       # CI mode

Exit codes:
    0 — every eligible file has all four required head tags
    1 — one or more files are missing a required tag (details printed)
    2 — script itself hit an unexpected error

Eligibility rules (what counts as a "user-facing page"):
    - .html file under REPO_ROOT (SKIP_DIRS filtered)
    - Contains a <html tag near the top (skips single-line verification
      files like google0490a1330efaf94c.html)
    - NOT marked <meta name="robots" content="...noindex...">
      (TEMPLATE.html and any other opt-out page are excluded)

Companion to scripts/verify_json_ld_parses.py + verify_sitemap_urls_exist.py
+ verify_state_dropdown_labels.py + verify_canonical_matches_url.py — same
scripts/ pattern, same zero-dependency Python 3 stdlib approach, same
file:line reporting.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from typing import Iterable, List, Tuple


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

SKIP_DIRS = {".git", "node_modules", "__pycache__", ".github"}

TITLE_TAG = re.compile(r"<title\b[^>]*>[^<]*</title\s*>", re.IGNORECASE)
META_DESCRIPTION = re.compile(
    r"""<meta\b[^>]*\bname\s*=\s*['"]description['"][^>]*\bcontent\s*=\s*['"][^'"]*['"][^>]*>""",
    re.IGNORECASE,
)
META_VIEWPORT = re.compile(
    r"""<meta\b[^>]*\bname\s*=\s*['"]viewport['"][^>]*\bcontent\s*=\s*['"][^'"]*['"][^>]*>""",
    re.IGNORECASE,
)
CANONICAL_LINK = re.compile(
    r"""<link\b[^>]*\brel\s*=\s*['"]canonical['"][^>]*\bhref\s*=\s*['"][^'"]*['"][^>]*>""",
    re.IGNORECASE,
)
CANONICAL_LINK_HREF_FIRST = re.compile(
    r"""<link\b[^>]*\bhref\s*=\s*['"][^'"]*['"][^>]*\brel\s*=\s*['"]canonical['"][^>]*>""",
    re.IGNORECASE,
)
NOINDEX_META = re.compile(
    r"""<meta\b[^>]*\bname\s*=\s*['"]robots['"][^>]*\bcontent\s*=\s*['"][^'"]*noindex[^'"]*['"]""",
    re.IGNORECASE,
)
HTML_OPEN_TAG = re.compile(r"<html\b", re.IGNORECASE)

# Tags in required order matching the four checks above.
REQUIRED_TAGS = [
    ("title", TITLE_TAG),
    ("meta[name=description]", META_DESCRIPTION),
    ("meta[name=viewport]", META_VIEWPORT),
    ("link[rel=canonical]", None),  # special: two possible orderings
]


def iter_html_files(root: str) -> Iterable[str]:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name.endswith(".html"):
                yield os.path.join(dirpath, name)


def check_file(path: str) -> Tuple[bool, bool, List[str]]:
    """Return (is_eligible, is_opt_out, missing_tag_names)."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
    except (OSError, UnicodeDecodeError) as e:
        return True, False, [f"read error ({e.__class__.__name__}: {e})"]

    if not HTML_OPEN_TAG.search(text):
        return False, False, []

    if NOINDEX_META.search(text):
        return True, True, []

    missing: List[str] = []
    for name, pattern in REQUIRED_TAGS:
        if name == "link[rel=canonical]":
            if not (CANONICAL_LINK.search(text) or
                    CANONICAL_LINK_HREF_FIRST.search(text)):
                missing.append(name)
        else:
            assert pattern is not None
            if not pattern.search(text):
                missing.append(name)
    return True, False, missing


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument(
        "--paths",
        nargs="+",
        help="Specific HTML files to check (default: walk whole repo)",
    )
    ap.add_argument(
        "--quiet",
        action="store_true",
        help="Only print failures + one-line summary",
    )
    args = ap.parse_args()

    if args.paths:
        files: List[str] = []
        for p in args.paths:
            abs_p = p if os.path.isabs(p) else os.path.join(REPO_ROOT, p)
            if not os.path.exists(abs_p):
                print(f"error: path does not exist: {p}", file=sys.stderr)
                return 2
            files.append(abs_p)
    else:
        files = sorted(iter_html_files(REPO_ROOT))

    total_files = 0
    eligible_files = 0
    opt_out_files = 0
    skipped_non_html = 0
    all_failures: List[Tuple[str, List[str]]] = []
    for path in files:
        total_files += 1
        eligible, opt_out, missing = check_file(path)
        if not eligible:
            skipped_non_html += 1
            continue
        eligible_files += 1
        if opt_out:
            opt_out_files += 1
            continue
        if missing:
            all_failures.append((os.path.relpath(path, REPO_ROOT), missing))

    if all_failures:
        print(f"FAIL  {len(all_failures)} file(s) missing required head tag(s) "
              f"({total_files} .html files scanned, {eligible_files} eligible, "
              f"{opt_out_files} noindex opt-outs, {skipped_non_html} non-html):")
        for rel_path, missing in all_failures[:50]:
            print(f"  {rel_path}: missing {', '.join(missing)}")
        if len(all_failures) > 50:
            print(f"  ... and {len(all_failures) - 50} more (showing first 50)")
        return 1

    if not args.quiet:
        print(f"OK  {eligible_files} pages have all 4 required head tags "
              f"(title, description, viewport, canonical); "
              f"{total_files} .html files scanned "
              f"({opt_out_files} noindex opt-outs, {skipped_non_html} non-html)")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"error: unexpected exception: {e.__class__.__name__}: {e}",
              file=sys.stderr)
        sys.exit(2)
