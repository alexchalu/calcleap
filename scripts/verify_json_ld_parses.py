#!/usr/bin/env python3
"""
verify_json_ld_parses.py — sitewide JSON-LD schema-block parse verifier.

Purpose (queue item (ffffffffffffffff), added 2026-07-28 evening log):
Prevent a JSON-LD schema block from silently breaking at commit time. Every
gold-standard blog post + calculator page ships with 2-4 <script
type="application/ld+json"> blocks (Article, BreadcrumbList, FAQPage,
WebApplication, WebSite, etc.). If a hand-edit introduces an unclosed brace,
unescaped quote, trailing comma, or bare-word identifier, Google's crawlers
silently drop the schema and we lose the rich-snippet eligibility. This script
walks every HTML file, extracts each JSON-LD block, parses via json.loads, and
reports any parse error with file:line and the truncated error context.

Usage:
    python3 scripts/verify_json_ld_parses.py                    # scan whole repo
    python3 scripts/verify_json_ld_parses.py --paths a.html b.html  # scan named files

Exit codes:
    0 — all JSON-LD blocks parse cleanly
    1 — one or more parse errors found (details printed)
    2 — script itself hit an unexpected error

Scope today:
    - Walks every .html file under the repo root (top-level, blog/, calc/, and
      any other subdirectory containing .html files).
    - Extracts each <script type="application/ld+json">...</script> block via
      regex (both `type="..."` and `type='...'` accepted; whitespace tolerant).
    - Feeds the raw block contents to json.loads and reports the first
      exception per block with the file:line pointing at the <script> open tag.
    - Reports the total files scanned + total blocks parsed + first ~10
      failures. Exit 1 if any failure.

Extensible: add non-HTML file-extension patterns to FILE_GLOBS below when
future pages migrate to other extensions. Add per-schema-type validation
(required fields per @type) as a future extension.

Companion to scripts/verify_state_dropdown_labels.py — same scripts/ pattern,
same zero-dependency Python 3 stdlib approach, same file:line reporting.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys
from typing import Iterable, List, Optional, Tuple


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# File-extension patterns to scan (relative to REPO_ROOT). Add here if the
# site ever ships JSON-LD in a non-.html file (e.g. .htm, .shtml).
FILE_GLOBS = ["**/*.html"]

# Directory names to skip during recursive walk. Keep the list narrow — we
# want to catch every real page but not waste time on VCS/build metadata.
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".github"}

# Matches: <script type="application/ld+json"> ... </script>
# Group 1 = the raw block contents. Non-greedy body match; multiline.
# Accepts both single- and double-quoted type attribute + optional extra
# attributes before the closing >.
JSON_LD_BLOCK = re.compile(
    r"<script\b[^>]*\btype\s*=\s*['\"]application/ld\+json['\"][^>]*>"
    r"(.*?)"
    r"</script\s*>",
    re.DOTALL | re.IGNORECASE,
)


def iter_html_files(root: str) -> Iterable[str]:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name.endswith(".html"):
                yield os.path.join(dirpath, name)


def line_of_offset(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def check_file(path: str) -> Tuple[int, List[str]]:
    """Return (blocks_parsed, failures) where failures are formatted strings."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
    except (OSError, UnicodeDecodeError) as e:
        return 0, [f"{path}:0: could not read file ({e.__class__.__name__}: {e})"]

    failures: List[str] = []
    blocks = 0
    for m in JSON_LD_BLOCK.finditer(text):
        blocks += 1
        body = m.group(1).strip()
        if not body:
            failures.append(
                f"{path}:{line_of_offset(text, m.start())}: empty JSON-LD block"
            )
            continue
        try:
            parsed = json.loads(body)
        except json.JSONDecodeError as e:
            preview = body[:80].replace("\n", " ")
            failures.append(
                f"{path}:{line_of_offset(text, m.start())}: JSON parse error "
                f"at block-line {e.lineno} col {e.colno}: {e.msg} "
                f"(block starts: '{preview}...')"
            )
            continue
        # Basic sanity: JSON-LD must be an object or a list of objects.
        if not isinstance(parsed, (dict, list)):
            failures.append(
                f"{path}:{line_of_offset(text, m.start())}: JSON-LD block "
                f"parsed to {type(parsed).__name__}, expected dict or list"
            )
            continue
        # If a dict, @context is expected. Warn but don't hard-fail on
        # unusual shapes (some pages use @graph containers legitimately).
        if isinstance(parsed, dict) and "@context" not in parsed and "@graph" not in parsed:
            failures.append(
                f"{path}:{line_of_offset(text, m.start())}: JSON-LD block "
                f"missing @context and @graph (may be invalid schema)"
            )
    return blocks, failures


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
        help="Only print failures + one-line summary (default: print files scanned count)",
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
    total_blocks = 0
    files_with_blocks = 0
    all_failures: List[str] = []
    for path in files:
        total_files += 1
        blocks, failures = check_file(path)
        if blocks:
            files_with_blocks += 1
        total_blocks += blocks
        all_failures.extend(failures)

    if all_failures:
        print(f"FAIL  {len(all_failures)} JSON-LD parse issue(s) in "
              f"{total_files} files ({total_blocks} blocks scanned):")
        for line in all_failures[:50]:
            print(f"  {line}")
        if len(all_failures) > 50:
            print(f"  ... and {len(all_failures) - 50} more (showing first 50)")
        return 1

    if not args.quiet:
        print(f"OK  {total_blocks} JSON-LD blocks parsed cleanly across "
              f"{files_with_blocks} files ({total_files} .html files scanned)")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"error: unexpected exception: {e.__class__.__name__}: {e}",
              file=sys.stderr)
        sys.exit(2)
