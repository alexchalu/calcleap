#!/usr/bin/env python3
"""
verify_state_dropdown_labels.py — sitewide state-dropdown drift verifier.

Purpose (queue item (oooooooooooooo), added 2026-07-26 evening log):
Prevent the 2026-07-25 dropdown-label-drift bug from recurring. When a
calculator's <select> options carry monetary/percentage values in the label
text (e.g. "District of Columbia ($4.99M exemption, 16% top)") and the same
values also live in a JS data structure (e.g. STATE_ESTATE_TAX.dc.exemption),
the two can drift out of sync when only the JS side is updated. This script
walks every HTML file under calc/, parses the two sides, and reports any
mismatch.

Usage:
    python3 scripts/verify_state_dropdown_labels.py [--paths calc/estate-tax-calculator.html ...]

Exit codes:
    0 — no drift found
    1 — one or more drift mismatches found (details printed)
    2 — parse error / unexpected input

Scope today:
    - Detects `const NAME = { key: {name:..., exemption:NUM, topRate:NUM, ...}, ... }`
      style state-tax data blocks (matches estate-tax-calculator.html).
    - For each such block, finds the `<select>` whose <option value="key">
      values overlap the JS keys, then compares the parsed dollar/percent
      inside the option label against the JS numbers.
    - Skips options where the label carries a rate RANGE (e.g. "10-20% or
      10-35%") or no `$X.XM exemption` phrase (e.g. the "None" option).

Extensible: add new data-block patterns to DATA_BLOCK_PATTERNS below when
future calcs introduce their own state-tax data shapes.
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from typing import Dict, List, Optional, Tuple


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Regex for a state-tax data block. Captures the block name and body.
# Matches: `const STATE_ESTATE_TAX = { ... };`
DATA_BLOCK_PATTERNS = [
    re.compile(
        r"const\s+(?P<name>[A-Z][A-Z0-9_]*(?:STATE|TAX|_ESTATE)[A-Z0-9_]*)\s*=\s*\{(?P<body>.*?)\n\};",
        re.DOTALL,
    ),
]

# Regex for one entry inside a data block:
#   ct:   {name:"Connecticut", exemption:15000000, topRate:0.12, ...}
ENTRY_RE = re.compile(
    r"(?P<key>[a-z]{2,4})\s*:\s*\{"
    r"[^}]*?"
    r"exemption\s*:\s*(?P<exemption>Infinity|-?\d+(?:\.\d+)?)"
    r"[^}]*?"
    r"topRate\s*:\s*(?P<toprate>-?\d+(?:\.\d+)?)"
    r"[^}]*?\}",
    re.DOTALL,
)

# Regex for one <select>...</select> block (non-greedy).
SELECT_RE = re.compile(r"<select\b[^>]*>(?P<body>.*?)</select>", re.DOTALL | re.IGNORECASE)

# Regex for one <option> inside a select.
OPTION_RE = re.compile(
    r"<option\s+[^>]*value\s*=\s*\"(?P<key>[a-z]{2,4})\"[^>]*>(?P<label>[^<]*)</option>",
    re.IGNORECASE,
)

# Regex for the "$X.XXM exemption" or "$X,XXX,XXX exemption" fragments in a label.
LABEL_EXEMPTION_RE = re.compile(
    r"\$\s*(?P<amt>[\d,\.]+)\s*(?P<unit>[MK]?)\s*exemption",
    re.IGNORECASE,
)

# Regex for the "16% top" fragment. Only matches a single percentage.
LABEL_TOPRATE_RE = re.compile(r"(?<![\d.])(?P<pct>\d{1,3}(?:\.\d+)?)\s*%\s*top", re.IGNORECASE)

# Rate-range detector (e.g. "10-20%", "10–35%"). When present in a label, we
# do NOT compare topRate — the calc routes to a sub-schedule (WA regimes).
LABEL_RATE_RANGE_RE = re.compile(r"\d+\s*[-–]\s*\d+\s*%")


class Finding:
    def __init__(self, path: str, line: int, message: str) -> None:
        self.path = path
        self.line = line
        self.message = message

    def __str__(self) -> str:  # pragma: no cover
        rel = os.path.relpath(self.path, REPO_ROOT)
        return f"{rel}:{self.line}: {self.message}"


def parse_label_exemption(label: str) -> Optional[float]:
    """Return the exemption dollar amount stated in the label, or None."""
    m = LABEL_EXEMPTION_RE.search(label)
    if not m:
        return None
    amt = m.group("amt").replace(",", "")
    try:
        value = float(amt)
    except ValueError:
        return None
    unit = m.group("unit").upper()
    if unit == "M":
        value *= 1_000_000
    elif unit == "K":
        value *= 1_000
    return value


def parse_label_toprate(label: str) -> Optional[float]:
    """Return the top-rate percentage stated in the label as a fraction, or None.

    Returns None if the label carries a rate RANGE (e.g. "10-20%") — the calc
    then routes to a sub-schedule and the option label is not the source of truth.
    """
    if LABEL_RATE_RANGE_RE.search(label):
        return None
    m = LABEL_TOPRATE_RE.search(label)
    if not m:
        return None
    try:
        return float(m.group("pct")) / 100.0
    except ValueError:
        return None


def exemption_labels_agree(label_value: float, js_value: float) -> bool:
    """The label uses rounded shorthand ($4.99M) vs the JS exact value ($4,988,400).

    Rule: round(js_value / 1e6, 2) must equal round(label_value / 1e6, 2).
    Works for $XM, $X.XM, and $X.XXM shorthand. For labels expressed in exact
    dollars, we also accept exact equality.
    """
    if abs(label_value - js_value) < 0.01:
        return True
    return round(js_value / 1_000_000, 2) == round(label_value / 1_000_000, 2)


def toprate_labels_agree(label_rate: float, js_rate: float) -> bool:
    """Label uses whole-percent shorthand (16% top) vs JS (0.16)."""
    return abs(round(label_rate, 4) - round(js_rate, 4)) < 1e-4


def line_of(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def find_data_blocks(text: str) -> List[Tuple[str, Dict[str, Dict[str, float]], int]]:
    """Return [(block_name, {key: {exemption, topRate}}, block_start_line), ...]."""
    blocks: List[Tuple[str, Dict[str, Dict[str, float]], int]] = []
    for pattern in DATA_BLOCK_PATTERNS:
        for m in pattern.finditer(text):
            name = m.group("name")
            body = m.group("body")
            entries: Dict[str, Dict[str, float]] = {}
            for em in ENTRY_RE.finditer(body):
                key = em.group("key")
                exemption_raw = em.group("exemption")
                exemption = float("inf") if exemption_raw == "Infinity" else float(exemption_raw)
                toprate = float(em.group("toprate"))
                entries[key] = {"exemption": exemption, "topRate": toprate}
            blocks.append((name, entries, line_of(text, m.start())))
    return blocks


def find_select_blocks(text: str) -> List[Tuple[int, str]]:
    return [(line_of(text, m.start()), m.group("body")) for m in SELECT_RE.finditer(text)]


def check_file(path: str) -> List[Finding]:
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()

    blocks = find_data_blocks(text)
    if not blocks:
        return []

    selects = find_select_blocks(text)
    findings: List[Finding] = []

    for block_name, entries, block_line in blocks:
        # A <select> matches this data block if it has ≥2 options whose
        # values overlap the block's keys (avoids matching an unrelated
        # dropdown that happens to share one key).
        matching_selects: List[Tuple[int, str]] = []
        for select_line, select_body in selects:
            option_keys = {om.group("key") for om in OPTION_RE.finditer(select_body)}
            overlap = option_keys & set(entries.keys())
            if len(overlap) >= 2:
                matching_selects.append((select_line, select_body))

        if not matching_selects:
            continue

        for select_line, select_body in matching_selects:
            for om in OPTION_RE.finditer(select_body):
                key = om.group("key")
                label = om.group("label")
                if key not in entries:
                    continue
                js_entry = entries[key]

                # Exemption check.
                label_exemption = parse_label_exemption(label)
                if label_exemption is not None and js_entry["exemption"] != float("inf"):
                    if not exemption_labels_agree(label_exemption, js_entry["exemption"]):
                        findings.append(Finding(
                            path,
                            select_line,
                            f"{block_name}.{key}: label exemption "
                            f"${label_exemption:,.0f} does not match JS "
                            f"exemption ${js_entry['exemption']:,.0f}  "
                            f"(label: {label.strip()!r})",
                        ))

                # Top-rate check.
                label_toprate = parse_label_toprate(label)
                if label_toprate is not None:
                    if not toprate_labels_agree(label_toprate, js_entry["topRate"]):
                        findings.append(Finding(
                            path,
                            select_line,
                            f"{block_name}.{key}: label topRate "
                            f"{label_toprate:.2%} does not match JS topRate "
                            f"{js_entry['topRate']:.2%}  "
                            f"(label: {label.strip()!r})",
                        ))

    return findings


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    ap.add_argument(
        "--paths",
        nargs="+",
        default=None,
        help="Explicit HTML paths to check. Default: all calc/*.html",
    )
    args = ap.parse_args()

    if args.paths:
        paths = [os.path.abspath(p) for p in args.paths]
    else:
        paths = sorted(glob.glob(os.path.join(REPO_ROOT, "calc", "*.html")))

    findings: List[Finding] = []
    checked = 0
    for path in paths:
        if not os.path.isfile(path):
            print(f"SKIP  {path} (not a file)", file=sys.stderr)
            continue
        checked += 1
        findings.extend(check_file(path))

    if findings:
        print(f"DRIFT ({len(findings)} mismatch{'es' if len(findings) != 1 else ''} in {checked} files):")
        for f in findings:
            print(f"  {f}")
        return 1

    print(f"OK  no dropdown-vs-data drift in {checked} files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
