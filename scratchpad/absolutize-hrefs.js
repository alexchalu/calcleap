#!/usr/bin/env node
/*
 * absolutize-hrefs.js — one-shot fix for queue item (gggggggggggg) +
 * (hhhhhhhhhhhh): sitewide subdir-to-root href absolutization pass.
 *
 * Pattern: pages inside subdirectories (e.g. /529/*, /medicaid/*, /sales/*,
 * /percent/*, /calc/*, /blog/*) carry `href="bmi-calculator.html"` etc.
 * The browser resolves those relative-to-subdir, hitting /529/bmi-calculator.html
 * which does not exist. The target actually lives at /bmi-calculator.html
 * (root). Fix: rewrite the href to root-absolute `/bmi-calculator.html`.
 *
 * Also (hhhhhhhhhhhh): `calc/mortgage-payment.html` does not exist. Real file
 * is `calc/mortgage-calculator.html`. Rename-rewrite to the real file.
 *
 * Zone-awareness: only touch hrefs OUTSIDE <script>/<style>/HTML-comments,
 * skip external schemes / protocol-relative / dynamic JS ${...} / templates.
 *
 * Idempotent: safe to re-run — an already-absolutized href is skipped.
 *
 * Runs against every .html in repo (ignores .git, node_modules, __pycache__).
 * Prints per-file rewrite counts and a summary.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['.git', 'node_modules', '__pycache__']);
const DRY = process.argv.includes('--dry');

const FILE_SET = new Set();
function toPosix(p) { return p.split(path.sep).join('/'); }

function walkAll(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkAll(full);
    else if (entry.isFile()) FILE_SET.add(toPosix(path.relative(ROOT, full)));
  }
}
walkAll(ROOT);

// GitHub Pages semantics identical to verify-html.js.
function resolveFileTarget(filePart) {
  if (filePart === '' || filePart === '/') filePart = 'index.html';
  if (filePart.endsWith('/')) {
    const idx = filePart + 'index.html';
    return FILE_SET.has(idx) ? idx : null;
  }
  if (FILE_SET.has(filePart)) return filePart;
  if (!/\.[a-z0-9]{1,8}$/i.test(filePart)) {
    if (FILE_SET.has(filePart + '.html')) return filePart + '.html';
    if (FILE_SET.has(filePart + '/index.html')) return filePart + '/index.html';
  }
  return null;
}

function isSkippedHref(h) {
  if (h === '' || h === '#' || h === '#top') return true;
  if (/^(?:https?:|mailto:|tel:|sms:|javascript:|data:|blob:|about:|ftp:|file:)/i.test(h)) return true;
  if (/^\/\//.test(h)) return true;
  if (/\$\{[^}]*\}/.test(h)) return true;
  if (/^\{\{/.test(h) || /^\{%/.test(h)) return true;
  return false;
}

function whiteout(src, re) { return src.replace(re, m => m.replace(/[^\n]/g, ' ')); }

// Return list of [start,end) HTML zones (i.e. NOT inside script/style/comment).
function htmlZones(src) {
  const masks = [];
  const marks = [];
  const push = (start, end) => marks.push({ start, end });
  const re1 = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
  const re2 = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
  const re3 = /<!--[\s\S]*?-->/g;
  let m;
  for (const re of [re1, re2, re3]) {
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) push(m.index, m.index + m[0].length);
  }
  marks.sort((a, b) => a.start - b.start);
  // Build allowed (HTML) zones as the complement.
  const zones = [];
  let cursor = 0;
  for (const mk of marks) {
    if (mk.start > cursor) zones.push([cursor, mk.start]);
    cursor = Math.max(cursor, mk.end);
  }
  if (cursor < src.length) zones.push([cursor, src.length]);
  return zones;
}

function inZones(zones, idx) {
  // Binary search
  let lo = 0, hi = zones.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [s, e] = zones[mid];
    if (idx < s) hi = mid - 1;
    else if (idx >= e) lo = mid + 1;
    else return true;
  }
  return false;
}

// (Prior log speculated a `calc/mortgage-payment.html` → `calc/mortgage-calculator.html`
// rename was needed; that file actually exists at calc/mortgage-payment.html, so
// simple root-absolutization is enough. No rename table.)

// Per-file rewrite counters, aggregated by target.
const globalTargets = new Map();
let filesTouched = 0;
let totalRewrites = 0;

function rewriteFile(rel) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  const fromDir = path.posix.dirname(toPosix(rel));
  const zones = htmlZones(src);
  const HREF_RE = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

  let out = '';
  let cursor = 0;
  let localRewrites = 0;
  let m;
  while ((m = HREF_RE.exec(src)) !== null) {
    const attrStart = m.index;
    if (!inZones(zones, attrStart)) continue;
    const raw = m[1] !== undefined ? m[1] : m[2];
    if (isSkippedHref(raw)) continue;
    if (raw.startsWith('/')) continue;     // already root-absolute
    if (raw.startsWith('#')) continue;     // fragment-only

    // Separate fragment/query
    let file = raw;
    let tail = '';
    const hashIdx = file.indexOf('#');
    if (hashIdx >= 0) { tail = file.slice(hashIdx); file = file.slice(0, hashIdx); }
    const qIdx = file.indexOf('?');
    if (qIdx >= 0) { tail = file.slice(qIdx) + tail; file = file.slice(0, qIdx); }

    if (file === '') continue; // fragment-only after strip

    // Resolve against current dir
    const asIs = path.posix.normalize(path.posix.join(fromDir, file));
    if (resolveFileTarget(asIs)) continue; // already resolves locally — leave alone

    // Try root-absolute form
    let rootTry = file.startsWith('./') ? file.slice(2) : file;
    // Skip if this href walks up (../foo) — those are deliberate cross-dir refs, don't absolutize.
    if (rootTry.startsWith('../')) continue;

    if (!resolveFileTarget(rootTry)) continue; // doesn't exist at root either — leave alone

    // Rewrite: emit original up to this match, then rebuilt href attr.
    out += src.slice(cursor, attrStart);
    const attrOriginal = m[0];
    const quote = m[1] !== undefined ? '"' : "'";
    const newHref = `href=${quote}/${rootTry}${tail}${quote}`;
    out += newHref;
    cursor = attrStart + attrOriginal.length;
    localRewrites++;
    globalTargets.set(rootTry, (globalTargets.get(rootTry) || 0) + 1);
  }
  if (localRewrites === 0) return 0;
  out += src.slice(cursor);
  if (!DRY) fs.writeFileSync(abs, out, 'utf8');
  filesTouched++;
  totalRewrites += localRewrites;
  return localRewrites;
}

const allHtml = [...FILE_SET].filter(p => p.endsWith('.html')).sort();
const perFile = [];
for (const rel of allHtml) {
  const n = rewriteFile(rel);
  if (n > 0) perFile.push([rel, n]);
}

// Report
perFile.sort((a, b) => b[1] - a[1]);
console.log(`Rewrites by target (top 20):`);
const targetList = [...globalTargets.entries()].sort((a, b) => b[1] - a[1]);
for (const [t, n] of targetList.slice(0, 20)) console.log(`  ${n.toString().padStart(5)}  /${t}`);
console.log(`\nTop 10 files by rewrite count:`);
for (const [f, n] of perFile.slice(0, 10)) console.log(`  ${n.toString().padStart(4)}  ${f}`);
console.log(`\n== absolutize-hrefs.js summary ==`);
console.log(`  Files touched : ${filesTouched}`);
console.log(`  Total rewrites: ${totalRewrites}`);
console.log(`  Unique targets: ${globalTargets.size}`);
console.log(`  Mode          : ${DRY ? 'DRY (no writes)' : 'APPLIED'}`);
