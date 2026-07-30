#!/usr/bin/env python3
"""
verify_canonical_matches_url.py — canonical-tag ↔ file-path drift verifier.

Purpose (queue item (nnnnnnnnnnnnnnnn), added 2026-07-29 evening log):
Prevent stale <link rel="canonical" href="..."> tags that point at the wrong
URL after a page is copied from a template or moved. Canonicals are the
primary duplicate-content signal to Google: two pages with the same canonical
consolidate into one; a canonical that points nowhere is worse than none at
all — it deranks the file that owns it. The gold-standard blog template ships
a canonical block that's expected to be updated per-page, and the calculator
template ships one too. This script verifies every canonical URL round-trips
back to the file that carries it.

Usage:
    python3 scripts/verify_canonical_matches_url.py                # scan whole repo
    python3 scripts/verify_canonical_matches_url.py --paths a.html b.html
    python3 scripts/verify_canonical_matches_url.py --strict       # also flag consolidations
    python3 scripts/verify_canonical_matches_url.py --quiet        # CI mode

Exit codes:
    0 — every canonical tag is either self-referring or points to a real file
    1 — one or more canonicals are broken (target does not exist, off-domain,
        or contains an un-substituted template placeholder)
    2 — script itself hit an unexpected error

What is flagged by default (broken canonicals, unambiguous drift):
    - canonical URL points at a file that does not exist in the repo
    - canonical URL is outside https://calcleap.com/ (off-domain)
    - canonical URL contains an un-substituted template placeholder ('{{')
    - more than one canonical tag on the same page

What is silently accepted by default (intentional-looking consolidations):
    - canonical points to a real file that is not the file carrying the tag —
      standard SEO consolidation pattern (e.g. top-level state-tax pages
      canonicalize to their /calc/ counterparts). Use --strict to surface
      these for manual review.

Skipped (intentionally not indexed, no canonical required):
    - files with <meta name="robots" content="...noindex..."> — TEMPLATE.html
      and any other opt-out page

Scope today:
    - Walks every .html file under the repo root (top-level, blog/, calc/,
      and any other subdirectory) using the same walk pattern as the other
      scripts/ verifiers.
    - Extracts <link rel="canonical" href="URL"> via regex (whitespace and
      attribute-order tolerant).
    - Normalizes URL → repo-relative path using the same convention as
      verify_sitemap_urls_exist.py (directory-suffix URLs map to index.html).
    - Accepts BOTH directory-style ("https://calcleap.com/foo/") and
      file-style ("https://calcleap.com/foo/index.html") canonicals for
      index.html files — Google treats them as equivalent, and the site
      corpus uses both forms today.
    - Files without any canonical tag are silently skipped — those are
      reported by verify_meta_tags_present.py, not here.

Companion to scripts/verify_json_ld_parses.py + verify_sitemap_urls_exist.py
+ verify_state_dropdown_labels.py + verify_meta_tags_present.py — same
scripts/ pattern, same zero-dependency Python 3 stdlib approach, same
file:line reporting.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from typing import Iterable, List, Optional, Tuple


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXPECTED_DOMAIN = "https://calcleap.com/"

SKIP_DIRS = {".git", "node_modules", "__pycache__", ".github"}

# Matches: <link rel="canonical" href="URL"> or <link href="URL" rel="canonical">
# Order-of-attributes tolerant, quote-style tolerant, whitespace tolerant.
CANONICAL_REL_FIRST = re.compile(
    r"""<link\b[^>]*\brel\s*=\s*['"]canonical['"][^>]*\bhref\s*=\s*['"]([^'"]+)['"][^>]*>""",
    re.IGNORECASE,
)
CANONICAL_HREF_FIRST = re.compile(
    r"""<link\b[^>]*\bhref\s*=\s*['"]([^'"]+)['"][^>]*\brel\s*=\s*['"]canonical['"][^>]*>""",
    re.IGNORECASE,
)

# Matches <meta name="robots" content="...noindex..."> — these pages are
# intentionally out of the index and don't need a valid canonical.
NOINDEX_META = re.compile(
    r"""<meta\b[^>]*\bname\s*=\s*['"]robots['"][^>]*\bcontent\s*=\s*['"][^'"]*noindex[^'"]*['"]""",
    re.IGNORECASE,
)


def iter_html_files(root: str) -> Iterable[str]:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name.endswith(".html"):
                yield os.path.join(dirpath, name)


def line_of_offset(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def find_canonicals(text: str) -> List[Tuple[int, str]]:
    """Return list of (line_number, canonical_url) matches, dedup'd by offset."""
    seen_offsets: set = set()
    results: List[Tuple[int, str]] = []
    for pattern in (CANONICAL_REL_FIRST, CANONICAL_HREF_FIRST):
        for m in pattern.finditer(text):
            if m.start() in seen_offsets:
                continue
            seen_offsets.add(m.start())
            results.append((line_of_offset(text, m.start()), m.group(1).strip()))
    return sorted(results, key=lambda r: r[0])


def url_to_repo_path(url: str) -> Optional[str]:
    """Strip domain and normalize to a repo-relative file path.

    Returns None if the URL is outside EXPECTED_DOMAIN.
    Directory-suffix URLs map to index.html.
    """
    if not url.startswith(EXPECTED_DOMAIN):
        return None
    rel = url[len(EXPECTED_DOMAIN):]
    # Strip any URL fragment or query string — canonicals should not carry
    # them, but strip defensively so the file-existence check is fair.
    for sep in ("#", "?"):
        if sep in rel:
            rel = rel.split(sep, 1)[0]
    if rel.endswith("/") or rel == "":
        rel = rel + "index.html"
    return rel


def same_repo_file(a_rel: str, b_abs: str) -> bool:
    """True if repo-relative path a_rel refers to the same file as b_abs."""
    a_abs = os.path.abspath(os.path.join(REPO_ROOT, a_rel))
    return os.path.normcase(a_abs) == os.path.normcase(os.path.abspath(b_abs))


def check_file(path: str, strict: bool = False) -> Tuple[bool, bool, List[str]]:
    """Return (had_canonical, skipped_noindex, failures)."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
    except (OSError, UnicodeDecodeError) as e:
        return False, False, [
            f"{path}:0: could not read file ({e.__class__.__name__}: {e})"
        ]

    canonicals = find_canonicals(text)
    if not canonicals:
        return False, False, []

    if NOINDEX_META.search(text):
        return True, True, []

    rel_path = os.path.relpath(path, REPO_ROOT)
    failures: List[str] = []

    if len(canonicals) > 1:
        lines = ", ".join(str(l) for l, _ in canonicals)
        failures.append(
            f"{rel_path}:{canonicals[0][0]}: {len(canonicals)} canonical tags "
            f"found on this page (lines {lines}); expected exactly one"
        )

    for line, url in canonicals:
        if "{{" in url or "}}" in url:
            failures.append(
                f"{rel_path}:{line}: canonical contains un-substituted template "
                f"placeholder: {url}"
            )
            continue
        target_rel = url_to_repo_path(url)
        if target_rel is None:
            failures.append(
                f"{rel_path}:{line}: canonical URL outside expected domain "
                f"({EXPECTED_DOMAIN}): {url}"
            )
            continue
        target_abs = os.path.join(REPO_ROOT, target_rel)
        target_exists = os.path.isfile(target_abs)
        is_self = same_repo_file(target_rel, path)
        if not target_exists:
            failures.append(
                f"{rel_path}:{line}: canonical points at '{target_rel}' but "
                f"that file does not exist in the repo (url={url})"
            )
            continue
        if not is_self and strict:
            failures.append(
                f"{rel_path}:{line}: canonical consolidates to '{target_rel}' "
                f"(not self); confirm intentional (url={url})"
            )

    return True, False, failures


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument(
        "--paths",
        nargs="+",
        help="Specific HTML files to check (default: walk whole repo)",
    )
    ap.add_argument(
        "--strict",
        action="store_true",
        help="Also flag canonicals pointing at a real file that is not self "
             "(surfaces consolidation choices for manual review)",
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
    files_with_canonical = 0
    files_skipped_noindex = 0
    all_failures: List[str] = []
    for path in files:
        total_files += 1
        had, skipped, failures = check_file(path, strict=args.strict)
        if had:
            files_with_canonical += 1
        if skipped:
            files_skipped_noindex += 1
        all_failures.extend(failures)

    if all_failures:
        print(f"FAIL  {len(all_failures)} canonical drift issue(s) across "
              f"{files_with_canonical} files with canonicals "
              f"({total_files} .html files scanned, "
              f"{files_skipped_noindex} skipped noindex):")
        for line in all_failures[:50]:
            print(f"  {line}")
        if len(all_failures) > 50:
            print(f"  ... and {len(all_failures) - 50} more (showing first 50)")
        return 1

    if not args.quiet:
        print(f"OK  {files_with_canonical} canonical tags resolve correctly "
              f"({total_files} .html files scanned, "
              f"{files_skipped_noindex} skipped noindex)")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"error: unexpected exception: {e.__class__.__name__}: {e}",
              file=sys.stderr)
        sys.exit(2)
